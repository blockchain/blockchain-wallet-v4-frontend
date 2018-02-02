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
    channelState.amountMsatRemote = channelState.amountMsatRemote.sub(msg.amountMsat)
    channelState.committed.push(wrapPayment(msg, direction))
  } else {
    channelState.amountMsatLocal = channelState.amountMsatLocal.sub(msg.amountMsat)
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
    channelState.amountMsatRemote = channelState.amountMsatRemote.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    channelState.amountMsatLocal = channelState.amountMsatLocal.add(payment.amount)
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
    channelState.amountMsatLocal = channelState.amountMsatLocal.add(payment.amount)
    channelState.committed = channelState.committed.filter(filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    channelState.amountMsatRemote = channelState.amountMsatLocal.add(payment.amount)
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

  let paramsRemoteote = ChannelParams(
    wrapPubKey(msg.fundingPubkey),
    msg.dustLimitSatoshis,
    msg.maxHtlcValueInFlightMsat,
    msg.channelReserveSatoshis,
    msg.htlcMinimumMsat,
    channel.paramsLocal.feeRatePerKw,
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

  channel.paramsRemote = paramsRemoteote
  channel.commitmentObscureHash = obscureHash(channel.paramsLocal.paymentBasepoint.pub, msg.paymentBasepoint)
  channel.stateRemote.nextCommitmentPoint = msg.firstPerCommitmentPoint

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
    channel.stateLocal.commitmentNumber,
    channel.stateLocal.amountMsatLocal,
    channel.stateLocal.amountMsatRemote,
    channel.paramsLocal.feeRatePerKw,
    channel.paramsLocal.dustLimitSatoshis,
    channel.paramsRemote.toSelfDelay,
    keySet,
    Funded.LOCAL_FUNDED
  )

  let sigCheck = checkCommitmentSignature(
    input.value,
    commitment.commitmentTx,
    channel.paramsLocal.fundingKey,
    channel.paramsRemote.fundingKey,
    msg.signature
  )

  assert(sigCheck)
  return channel
}

export function readFundingLocked (channel, msg) {
  channel.stateLocal.nextCommitmentPoint = msg.nextCommitmentPoint
  channel.fundingLockedReceived = true

  if (channel.fundingLockedSent === true) {
    channel.phase = phase.OPEN
  }
  return channel
}

export let readUpdateAddHtlc = (channel, msg) => {
  // checkChannel(channel, ) //TODO check channel
  channel.stateRemote.indexes.inU = channel.stateRemote.indexes.inU.add(1)
  channel.stateLocal.updateCounter = channel.stateLocal.updateCounter.add(1)
  channel = addWrapper(channel, 'stateLocal', ChannelUpdateTypes.ADD, Direction.OFFERED, msg)

  // TODO check index
  // assert.deepEqual(msg.id, channel.remote.indexes.inU.add(1))
  // TODO check amount
  // TODO go through staged payments and calculate there are enough funds

  return channel
}

export function readCommitmentSigned (channel, msg) {
  let channelStateComm = copy(channel.stateLocal)

  // We received a commitment message from the other party
  // We need to apply all the local diffs
  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO create commitment transaction
  // TODO check commitment signature

  channel.stateLocal.commitIndex = channel.stateLocal.updateCounter
  return channel
}

export function readRevokeAck (channel, msg) {
  // TODO check commitments and compact our commitment store
  let channelState = copy(channel.stateRemote)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the remote unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack.filter(filter)
  channel.stateRemote = channelState
  channel.stateLocal.ack.push(...updatesToCommit)
  channel.stateRemote.unack = channel.stateRemote.unack.filter(a => !filter(a))
  channel.stateRemote.ack = []

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
  channel.paramsLocal = createChannelParams(options)
  channel.phase = phase.SENT_OPEN
  channel.commitmentSecretSeed = getRandomBytes(32)
  channel.stateLocal.nextCommitmentPoint = generatePerCommitmentPoint(channel.commitmentSecretSeed, Math.pow(2, 48) - 1)
  channel.stateLocal.amountMsatLocal = Long.fromNumber(value).mul(1000)
  channel.stateLocal.amountMsatRemote = Long.fromNumber(0)
  channel.stateRemote.amountMsatRemote = Long.fromNumber(value).mul(1000)
  channel.stateRemote.amountMsatLocal = Long.fromNumber(0)

  return channel
}

export function createOpenChannel (peer, options, value) {
  let channel = createChannel(peer, options, value)
  let params = channel.paramsLocal

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
    channel.stateLocal.nextCommitmentPoint,
    Buffer.alloc(1),
    params.shutdownScriptpubkey
  )

  return {channel, msg}
}

export function createFundingOutput (channel) {
  return {
    address: Script.wrapP2WSH(
    Script.getFundingOutputScript(
      channel.paramsRemote.fundingKey.pub,
      channel.paramsLocal.fundingKey.pub)),
    value: channel.stateLocal.amountMsatLocal.div(1000).toNumber()
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
    channel.stateRemote.commitmentNumber,
    channel.stateRemote.amountMsatLocal,
    channel.stateRemote.amountMsatRemote,
    channel.paramsRemote.feeRatePerKw,
    channel.paramsRemote.dustLimitSatoshis.toNumber(),
    channel.paramsLocal.toSelfDelay,
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
  channel.stateLocal.indexes.inU = channel.stateLocal.indexes.inU.add(1)
  channel.stateRemote.updateCounter = channel.stateRemote.updateCounter.add(1)

  // TODO check if we actually have enough money to make this payment
  let paymentIndex = channel.stateLocal.indexes.inU
  let msg = createAddMessage(channel.channelId, paymentIndex, payment)

  channel = addWrapper(channel, 'stateRemote', ChannelUpdateTypes.ADD, Direction.RECEIVED, msg)

  return {channel, msg}
}

export function createCommitmentSigned (channel) {
  channel = copy(channel)
  let channelStateComm = copy(channel.stateRemote)

  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO prune payment list
  // TODO create commitment transaction
  // TODO sign commitment transaction
  // TODO sign payment transactions

  let msg = CommitmentSigned(channel.channelId, null, 0, null)

  channel.stateRemote.commitIndex = channel.stateRemote.updateCounter
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
  let channelState = copy(channel.stateLocal)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the local unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack
    .filter(filter)
    .map(reverseWrapper)

  channel.stateLocal = channelState
  channel.stateRemote.ack.push(...updatesToCommit)
  channel.stateLocal.unack = channel.stateLocal.unack.filter(a => !filter(a))
  channel.stateLocal.ack = []

  return {channel, msg}
}
