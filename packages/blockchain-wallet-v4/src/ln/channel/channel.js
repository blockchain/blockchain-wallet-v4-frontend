import {
  CommitmentSigned, FundingCreated, FundingLocked, OpenChannel, RevokeAndAck,
  UpdateAddHtlc
} from '../messages/serializer'
import * as random from 'crypto'
import assert from 'assert'
import {
  Channel, ChannelParams, ChannelUpdateTypes, ChannelUpdateWrapper, Direction, Funded, Payment,
  PaymentWrapper
} from './state'

import {fromJS} from 'immutable'
import {generatePerCommitmentPoint} from '../key_derivation'
import {
  checkCommitmentSignature, createSigCheckKeySet, createSigCreateKeySet, getCommitmentTransaction,
  getFundingTransaction
} from './transactions'
import xor from 'buffer-xor'
import {copy, wrapHex} from '../helper'
import TYPE from '../messages/types'

const ec = require('secp256k1')
const Long = require('long')
const sha = require('sha256')

export let handleChannelMessage = (channel, peer, msg) => {
  channel = copy(channel)
  switch (msg.type) {
    case TYPE.ACCEPT_CHANNEL: return readAcceptChannel(channel, msg, peer)
    case TYPE.FUNDING_SIGNED: return readFundingSigned(channel, msg)

    case TYPE.UPDATE_ADD_HTLC: return readUpdateAddHtlc(channel, msg)
    case TYPE.COMMITMENT_SIGNED: return readCommitmentSigned(channel, msg)
    case TYPE.REVOKE_AND_ACK: return readRevokeAck(channel, msg)

    case TYPE.ANNOUNCEMENT_SIGNATURES: return channel
    case TYPE.CHANNEL_ANNOUNCEMENT: return channel
    case TYPE.NODE_ANNOUNCEMENT: return channel
    case TYPE.CHANNEL_UPDATE: return channel

    default: throw new Error('No message handler for ' + JSON.stringify(msg))
  }
}

export let phase = {
  SENT_OPEN: 1,
  FUNDING_BROADCASTED: 2,
  OPEN: 5
}

let createKey = () => {
  let key = {}
  key.priv = Buffer.from(random.randomBytes(32))
  key.pub = ec.publicKeyCreate(key.priv, true)
  return fromJS(key)
}

export let wrapPubKey = (pub) => ({pub, priv: null})

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

let localPaymentIndexPath = ['local', 'indexes', 'inU']
let localUpdateCounterPath = ['local', 'updateCounter']

let remotePaymentIndexPath = ['remote', 'indexes', 'inU']
let remoteUpdateCounterPath = ['remote', 'updateCounter']

let increment = path => c => c.updateIn(path, i => i.add(1))

let addWrapper = (channel, list, type, direction, msg) => {
  channel = copy(channel)
  let commitIndex = channel.index.updateCounter
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
    channel.paramsLocal.feeRatePerKw,
    msg.toSelfDelay,
    msg.maxAcceptedHtlcs,
    wrapPubKey(msg.revocationBasepoint),
    wrapPubKey(msg.paymentBasepoint),
    wrapPubKey(msg.delayedPaymentBasepoint),
    wrapPubKey(msg.htlcBasepoint),
    msg.shutdownScriptpubkey,
    peer.gf,
    peer.lf)

  channel.paramsRemote = paramsRemote
  channel.minimumDepth = msg.minimumDepth
  channel.commitmentObscureHash = obscureHash(channel.paramsLocal.paymentBasepoint.pub, msg.paymentBasepoint)
  channel.remote.nextCommitmentPoint = msg.firstPerCommitmentPoint

  return channel
}

export function readFundingSigned (channel, msg) {
  checkChannel(channel, phase.SENT_OPEN)

  let keySet = createSigCheckKeySet(channel)

  let input = channel.commitmentInput
  let commitment = getCommitmentTransaction(
    input,
    channel.commitmentObscureHash,
    [],
    channel.local.commitmentNumber,
    channel.local.amountMsatLocal,
    channel.local.amountMsatRemote,
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

  console.info('Signature Check: ' + sigCheck)
  assert(sigCheck)
  // TODO need to wire up somehow with broadcasting transaction and keeping track of confirmations

  return channel
}

export function readFundingLocked (channel, msg) {
  channel.local.nextCommitmentPoint = msg.nextCommitmentPoint
  channel.fundingLockedReceived = true

  if (channel.fundingLockedSent === true) {
    channel.phase = phase.OPEN
  }
}

export let readUpdateAddHtlc = (channel, msg) => {
  // checkChannel(channel, ) //TODO check channel
  channel = increment(remotePaymentIndexPath)(channel)
  channel = increment(localUpdateCounterPath)(channel)
  channel = addWrapper(channel, 'local', ChannelUpdateTypes.ADD, Direction.OFFERED, msg)

  // TODO check index
  // assert.deepEqual(msg.id, channel.remote.indexes.inU.add(1))
  // TODO check amount
  // TODO go through staged payments and calculate there are enough funds

  return channel
}

export function readCommitmentSigned (channel, msg) {
  let channelStateComm = copy(channel.local)

  // We received a commitment message from the other party
  // We need to apply all the local diffs
  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO create commitment transaction
  // TODO check commitment signature

  channel.local.commitIndex = channel.local.updateCounter
  return channel
}

export function readRevokeAck (channel, msg) {
  // TODO check commitments and compact our commitment store
  let channelState = copy(channel.remote)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the remote unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack.filter(filter)
  channel.remote = channelState
  channel.local.ack.push(...updatesToCommit)
  channel.remote.unack = channel.remote.unack.filterNot(filter)
  channel.remote.ack = []

  return channel
}

// Methods accepting a channel object, and returning a new mutated version of it (needs defensive copying)
//     and the message to be sent to other peer
export function createOpenChannel (peer, options, value) {
  let channelId = random.randomBytes(32) // TODO
  let commitmentSecret = random.randomBytes(32)

  let paramsLocal = ChannelParams(
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
    options.lf)
  let paramsJS = paramsLocal

  let nextCommitmentPoint = generatePerCommitmentPoint(commitmentSecret, Math.pow(2, 48) - 1)

  let msg = OpenChannel(
    options.chainHash,
    channelId,
    value,
    new Long(0),
    paramsJS.dustLimitSatoshis,
    value,
    new Long(0),
    new Long(0),
    paramsJS.feeRatePerKw,
    paramsJS.toSelfDelay,
    paramsJS.maxAcceptedHtlcs,
    paramsJS.fundingKey.pub,
    paramsJS.revocationBasepoint.pub,
    paramsJS.paymentBasepoint.pub,
    paramsJS.delayedPaymentBasepoint.pub,
    paramsJS.htlcBasepoint.pub,
    nextCommitmentPoint,
    Buffer.alloc(1),
    paramsJS.shutdownScriptpubkey
  )

  let channel = Channel()
  channel.staticRemote = peer
  channel.channelId = channelId
  channel.commitmentInput.value = value.toNumber()
  channel.paramsLocal = paramsLocal
  channel.phase = phase.SENT_OPEN
  channel.commitmentSecretSeed = commitmentSecret
  channel.local.nextCommitmentPoint = nextCommitmentPoint
  channel.local.amountMsatLocal = Long.fromNumber(value).mul(1000)
  channel.local.amountMsatRemote = Long.fromNumber(0)
  channel.remote.amountMsatRemote = Long.fromNumber(value).mul(1000)
  channel.remote.amountMsatLocal = Long.fromNumber(0)

  return {channel, msg}
}

export function createFundingCreated (channel, wallet) {
  checkChannel(channel, phase.SENT_OPEN)

  let fundingTx = getFundingTransaction(
    wallet.unspents,
    channel.paramsRemote.fundingKey.pub,
    channel.paramsLocal.fundingKey.pub,
    channel.local.amountMsatLocal.div(1000).toNumber(),
    1000)

  let fundingHash = fundingTx.hash()

  channel.commitmentInput.hash = fundingHash
  channel.commitmentInput.n = 0

  console.info('Created funding transaction: \n' + fundingTx.toRaw().toString('hex'))
  channel.fundingTx = fundingTx.toRaw()
  channel.phase = phase.FUNDING_BROADCASTED

  let keySet = createSigCreateKeySet(channel)

  let commitment = getCommitmentTransaction(
    channel.commitmentInput,
    channel.commitmentObscureHash,
    [],
    channel.remote.commitmentNumber,
    channel.remote.amountMsatLocal,
    channel.remote.amountMsatRemote,
    channel.paramsRemote.feeRatePerKw,
    channel.paramsRemote.dustLimitSatoshis.toNumber(),
    channel.paramsLocal.toSelfDelay,
    keySet,
    Funded.REMOTE_FUNDED
  )

  channel.channelId = calculateChannelId(channel.commitmentInput)
  let msg = FundingCreated(
    channel.channelId,
    fundingHash,
    0,
    commitment.commitmentSig
  )

  return {channel, msg}
}

export function createFundingLocked (channel) {
  channel.fundingLockedSent = true
  if (channel.fundingLockedReceived === true) {
    channel.phase = phase.OPEN
  }
  let msg = FundingLocked(
    channel.channelId,
    Buffer.create(33) // TODO
  )

  return {channel, msg}
}

export function createUpdateAddHtlc (channel, payment) {
  // checkChannel(channel, ) //TODO check channel
  channel = copy(channel)
  channel = increment(localPaymentIndexPath)(channel)
  channel = increment(remoteUpdateCounterPath)(channel)

  // TODO check if we actually have enough money to make this payment
  let paymentIndex = channel.local.indexes.inU
  let msg = createAddMessage(channel.channelId, paymentIndex, payment)

  channel = addWrapper(channel, 'remote', ChannelUpdateTypes.ADD, Direction.RECEIVED, msg)

  return {channel, msg}
}

export function createCommitmentSigned (channel) {
  channel = copy(channel)
  let channelStateComm = copy(channel.remote)

  channelStateComm = applyWrapperList(channelStateComm.ack, channelStateComm)
  channelStateComm = applyWrapperList(channelStateComm.unack, channelStateComm)

  let paymentList = channelStateComm.committed
  // TODO prune payment list
  // TODO create commitment transaction
  // TODO sign commitment transaction
  // TODO sign payment transactions

  let msg = CommitmentSigned(channel.channelId, null, 0, null)

  channel.remote.commitIndex = channel.remote.updateCounter
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
  let channelState = copy(channel.local)

  channelState = applyWrapperList(channelState.ack, channelState)
  channelState = applyWrapperList(channelState.unack, channelState)

  // We also need to copy the local unack list
  let commitIndex = channelState.commitIndex
  let filter = a => a.index.lte(commitIndex)

  let updatesToCommit = channelState.unack
    .filter(filter)
    .map(reverseWrapper)

  channel.local = channelState
  channel.remote.ack.push(...updatesToCommit)
  channel.local.unack = channel.local.unack.filterNot(filter)
  channel.local.ack = []

  return {channel, msg}
}
