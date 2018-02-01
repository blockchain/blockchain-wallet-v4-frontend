import {
  CommitmentSigned, FundingCreated, FundingLocked, OpenChannel, RevokeAndAck,
  UpdateAddHtlc
} from '../messages/serializer'
import * as random from 'crypto'
import assert from 'assert'
import {
  Channel, ChannelParams, ChannelUpdateTypes, ChannelUpdateWrapper, Direction, Funded, Payment,
  PaymentWrapper, Wallet
} from './state'

import {generatePerCommitmentPoint} from '../key_derivation'
import {
  checkCommitmentSignature, createSigCheckKeySet, createSigCreateKeySet, getCommitmentTransaction,
  getFundingTransaction
} from './transactions'
import xor from 'buffer-xor'
import {copy, createKey, getRandomBytes, wrapHex, wrapPubKey} from '../helper'
import {wrapP2WSH} from '../scripts'
import * as Script from '../scripts'

let Tx = require('bcoin/lib/primitives/tx')
const Long = require('long')
const sha = require('sha256')

export let phase = {
  SENT_OPEN: 1,
  SENT_FUNDING_CREATED: 2,
  FUNDING_BROADCASTED: 3,
  OPEN: 5
}

let checkChannel = (channel, phase) => {
  assert(channel !== undefined)
  assert(channel.phase === phase)
}

export let obscureHash = (basePoint1, basePoint2) => {
  let b = Buffer.concat([basePoint1, basePoint2])
  return wrapHex(sha(b))
}

let calculateChannelId = (commitmentInput) => {
  let hash = commitmentInput.hash
  let n = commitmentInput.n

  let id = hash.slice(0, 32)
  let nBuffer = Buffer.alloc(2)
  nBuffer.writeUInt16BE(n, 0)

  let x = xor(hash.slice(30, 31), nBuffer)
  x.copy(id, 30)
  return id
}

let reverseWrapper = (wrapper) => {
  wrapper = copy(wrapper)
  if (wrapper.direction === Direction.OFFERED) {
    wrapper.direction = Direction.RECEIVED
  } else {
    wrapper.direction = Direction.OFFERED
  }
  return wrapper
}

let getPaymentI = (state, id) => state.payments.mapI.id
let getPaymentO = (state, id) => state.payments.mapO.id

let filterPayment = (id) => { return a => { return a !== id } }
let wrapPayment = (msg, direction) => PaymentWrapper(direction, msg.id, Payment(msg.amountMsat, msg.paymentHash, msg.onionRoutingPackage, msg.cltvTimeout))

let applyAdd = (channelState, msg, direction) => {
  // A new payment is added to the channelState
  // We need to remove balance and add it to the commitment tx
  channelState = copy(channelState)
  if (direction === Direction.RECEIVED) {
    channelState.amountMsatRem = channelState.amountMsatRem.sub(msg.amountMsat)
    channelState.committed.push(wrapPayment(msg, direction))
  } else {
    channelState.amountMsatLoc = channelState.amountMsatLoc.sub(msg.amountMsat)
    channelState.committed.push(wrapPayment(msg, direction))
  }
  return channelState
}

let applyFulfill = (channelState, msg, direction) => {
  // This payment got successfully resolved
  // We credit our balance with the amount of the payment and
  // remove it from the commitment tx
  // TODO need to save the secret somewhere
  channelState = copy(channelState)
  if (direction === Direction.RECEIVED) {
    let payment = getPaymentO(channelState, msg.id)
    channelState.amountMsatRem = channelState.amountMsatRem.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    channelState.amountMsatLoc = channelState.amountMsatLoc.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  }
  return channelState
}

let applyFail = (channelState, msg, direction) => {
  // This payment failed, this means we need to credit our balance with
  // the amount of this payment again and remove it from the commitment tx
  channelState = copy(channelState)
  if (direction === Direction.RECEIVED) {
    let payment = getPaymentO(channelState, msg.id)
    channelState.amountMsatLoc = channelState.amountMsatLoc.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    channelState.amountMsatRem = channelState.amountMsatLoc.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  }
  return channelState
}

// TODO do we need to handle this case much differently?
let applyMalformed = (channelState, fail, direction) => applyFail(channelState, fail, direction)

let applyWrapper = (channelState, wrapper) => {
  let {type, direction, msg} = wrapper

  if (type === ChannelUpdateTypes.ADD) {
    return applyAdd(channelState, msg, direction)
  } else if (type === ChannelUpdateTypes.FULFILL) {
    return applyFulfill(channelState, msg, direction)
  } else if (type === ChannelUpdateTypes.FAIL) {
    return applyFail(channelState, msg, direction)
  } else if (type === ChannelUpdateTypes.FAIL_MALFORMED) {
    return applyMalformed(channelState, msg, direction)
  } else {
    throw new Error('Unknown wrapper? ' + JSON.stringify(wrapper))
  }
}

let applyWrapperList = (list, state) => list.reduce((s, w) => applyWrapper(s, w), state)

let addWrapper = (channel, list, type, direction, msg) => {
  channel = copy(channel)
  let commitIndex = channel[list].updateCounter
  channel[list].unack.push(ChannelUpdateWrapper(type, direction, commitIndex, msg))
  return channel
}

let createAddMessage = (channelId, paymentIndex, payment) => {
  return UpdateAddHtlc(
    channelId,
    paymentIndex,
    payment.amount,
    payment.paymentHash,
    payment.cltvTimeout,
    payment.onionRoutingPackage)
}

// Methods accepting a channel and message object, returning a mutation of the argument
//    therefore requiring a defensive copy.
export function readAcceptChannel (channel, msg, peer) {
  checkChannel(channel, phase.SENT_OPEN)

  let paramsRemote = ChannelParams(
    wrapPubKey(msg.fundingPubkey),
    msg.dustLimitSatoshis,
    msg.maxHtlcValueInFlightMsat,
    msg.channelReserveSatoshis,
    msg.htlcMinimumMsat,
    channel.paramsLoc.feeRatePerKw,
    msg.toSelfDelay,
    msg.maxAcceptedHtlcs,
    wrapPubKey(msg.revocationBasepoint),
    wrapPubKey(msg.paymentBasepoint),
    wrapPubKey(msg.delayedPaymentBasepoint),
    wrapPubKey(msg.htlcBasepoint),
    msg.shutdownScriptpubkey,
    peer.gf,
    peer.lf,
    msg.minimumDepth)

  channel.paramsRem = paramsRemote
  channel.commitmentObscureHash = obscureHash(channel.paramsLoc.paymentBasepoint.pub, msg.paymentBasepoint)
  channel.stateRem.nextCommitmentPoint = msg.firstPerCommitmentPoint

  return channel
}

export function readFundingSigned (channel, msg) {
  checkChannel(channel, phase.SENT_FUNDING_CREATED)

  let keySet = createSigCheckKeySet(channel)

  let input = channel.commitmentInput
  let commitment = getCommitmentTransaction(
    input,
    channel.commitmentObscureHash,
    [],
    channel.stateLoc.commitmentNumber,
    channel.stateLoc.amountMsatLoc,
    channel.stateLoc.amountMsatRem,
    channel.paramsLoc.feeRatePerKw,
    channel.paramsLoc.dustLimitSatoshis,
    channel.paramsRem.toSelfDelay,
    keySet,
    Funded.LOCAL_FUNDED
  )

  let sigCheck = checkCommitmentSignature(
    input.value,
    commitment.commitmentTx,
    channel.paramsLoc.fundingKey,
    channel.paramsRem.fundingKey,
    msg.signature
  )

  assert(sigCheck)
  return channel
}

export function readFundingLocked (channel, msg) {
  channel.stateLoc.nextCommitmentPoint = msg.nextCommitmentPoint
  channel.fundingLockedReceived = true

  if (channel.fundingLockedSent === true) {
    channel.phase = phase.OPEN
  }
  return channel
}

export let readUpdateAddHtlc = (channel, msg) => {
  // checkChannel(channel, ) //TODO check channel
  channel.stateRem.indexes.inU = channel.stateRem.indexes.inU.add(1)
  channel.stateLoc.updateCounter = channel.stateLoc.updateCounter.add(1)
  channel = addWrapper(channel, 'stateLoc', ChannelUpdateTypes.ADD, Direction.OFFERED, msg)

  // TODO check index
  // assert.deepEqual(msg.id, channel.remote.indexes.inU.add(1))
  // TODO check amount
  // TODO go through staged payments and calculate there are enough funds

  return channel
}

export function readCommitmentSigned (channel, msg) {
  let channelStateComm = copy(channel.stateLoc)

  // We received a commitment message from the other party
  // We need to apply all the local diffs
  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO create commitment transaction
  // TODO check commitment signature

  channel.stateLoc.commitIndex = channel.stateLoc.updateCounter
  return channel
}

export function readRevokeAck (channel, msg) {
  // TODO check commitments and compact our commitment store
  let channelState = copy(channel.stateRem)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the remote unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack.filter(filter)
  channel.stateRem = channelState
  channel.stateLoc.ack.push(...updatesToCommit)
  channel.stateRem.unack = channel.stateRem.unack.filter(a => !filter(a))
  channel.stateRem.ack = []

  return channel
}

// Methods accepting a channel object, and returning a new mutated version of it (needs defensive copying)
//     and the message to be sent to other peer

export function createChannelParams (options) {
  return ChannelParams(
    createKey(),
    options.dustLimitSatoshis,
    options.maxHtlcValueInFlightMsat,
    options.channelReserveSatoshis,
    options.htlcMinimumMsat,
    options.feeRatePerKw,
    options.toSelfDelay,
    options.maxAcceptedHtlcs,
    createKey(),
    createKey(),
    createKey(),
    createKey(),
    Buffer.alloc(35), // TODO generate shutdown script
    options.gf,
    options.lf,
    options.minimumDepth)
}

export function createChannel (peer, options, value) {
  let channel = Channel()
  channel.keyRemote = peer
  channel.channelId = getRandomBytes(32)
  channel.commitmentInput.value = value.toNumber()
  channel.paramsLoc = createChannelParams(options)
  channel.phase = phase.SENT_OPEN
  channel.commitmentSecretSeed = getRandomBytes(32)
  channel.stateLoc.nextCommitmentPoint = generatePerCommitmentPoint(channel.commitmentSecretSeed, Math.pow(2, 48) - 1)
  channel.stateLoc.amountMsatLoc = Long.fromNumber(value).mul(1000)
  channel.stateLoc.amountMsatRem = Long.fromNumber(0)
  channel.stateRem.amountMsatRem = Long.fromNumber(value).mul(1000)
  channel.stateRem.amountMsatLoc = Long.fromNumber(0)

  return channel
}

export function createOpenChannel (peer, options, value) {
  let channel = createChannel(peer, options, value)
  let params = channel.paramsLoc

  let msg = OpenChannel(
    options.chainHash,
    channel.channelId,
    value,
    new Long(0),
    params.dustLimitSatoshis,
    value,
    new Long(0),
    new Long(0),
    params.feeRatePerKw,
    params.toSelfDelay,
    params.maxAcceptedHtlcs,
    params.fundingKey.pub,
    params.revocationBasepoint.pub,
    params.paymentBasepoint.pub,
    params.delayedPaymentBasepoint.pub,
    params.htlcBasepoint.pub,
    channel.stateLoc.nextCommitmentPoint,
    Buffer.alloc(1),
    params.shutdownScriptpubkey
  )

  return {channel, msg}
}

export function createFundingOutput (channel) {
  return {
    address: Script.wrapP2WSH(
    Script.getFundingOutputScript(
      channel.paramsRem.fundingKey.pub,
      channel.paramsLoc.fundingKey.pub)),
    value: channel.stateLoc.amountMsatLoc.div(1000).toNumber()
  }
}

export function createFundingCreated (channel) {
  checkChannel(channel, phase.SENT_OPEN)

  let fundingTx = Tx.fromRaw(wrapHex(channel.fundingTx))
  let fundingHash = fundingTx.hash()

  channel.commitmentInput.hash = fundingHash
  channel.commitmentInput.n = 0 // TODO need to check which output pays to the script..
  channel.phase = phase.SENT_FUNDING_CREATED

  let keySet = createSigCreateKeySet(channel)

  let commitment = getCommitmentTransaction(
    channel.commitmentInput,
    channel.commitmentObscureHash,
    [],
    channel.stateRem.commitmentNumber,
    channel.stateRem.amountMsatLoc,
    channel.stateRem.amountMsatRem,
    channel.paramsRem.feeRatePerKw,
    channel.paramsRem.dustLimitSatoshis.toNumber(),
    channel.paramsLoc.toSelfDelay,
    keySet,
    Funded.REMOTE_FUNDED
  )

  let msg = FundingCreated(
    channel.channelId,
    fundingHash,
    0,
    commitment.commitmentSig
  )
  channel.channelId = calculateChannelId(channel.commitmentInput)

  return {channel, msg}
}

export function createFundingLocked (channel) {
  channel.fundingLockedSent = true
  if (channel.fundingLockedReceived === true) {
    channel.phase = phase.OPEN
  }
  let msg = FundingLocked(
    channel.channelId,
    Buffer.alloc(33) // TODO
  )

  return {channel, msg}
}

export function createUpdateAddHtlc (channel, payment) {
  // checkChannel(channel, ) //TODO check channel
  channel = copy(channel)
  channel.stateLoc.indexes.inU = channel.stateLoc.indexes.inU.add(1)
  channel.stateRem.updateCounter = channel.stateRem.updateCounter.add(1)

  // TODO check if we actually have enough money to make this payment
  let paymentIndex = channel.stateLoc.indexes.inU
  let msg = createAddMessage(channel.channelId, paymentIndex, payment)

  channel = addWrapper(channel, 'stateRem', ChannelUpdateTypes.ADD, Direction.RECEIVED, msg)

  return {channel, msg}
}

export function createCommitmentSigned (channel) {
  channel = copy(channel)
  let channelStateComm = copy(channel.stateRem)

  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO prune payment list
  // TODO create commitment transaction
  // TODO sign commitment transaction
  // TODO sign payment transactions

  let msg = CommitmentSigned(channel.channelId, null, 0, null)

  channel.stateRem.commitIndex = channel.stateRem.updateCounter
  return {channel, msg}
}

export function createRevokeAck (channel) {
  channel = copy(channel)

  // TODO revocation secrets
  let msg = RevokeAndAck(channel.channelId, null, null)

  // We are permanently committing to the new state by revoking the old state
  // After sending this message, the comm list will be merged to the committed list
  // This message also serves as an ack message for all the staged updates, such that
  // we can safely merge them into our counterparties ack list.
  let channelState = copy(channel.stateLoc)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the local unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack
    .filter(filter)
    .map(reverseWrapper)

  channel.stateLoc = channelState
  channel.stateRem.ack.push(...updatesToCommit)
  channel.stateLoc.unack = channel.stateLoc.unack.filter(a => !filter(a))
  channel.stateLoc.ack = []

  return {channel, msg}
}
