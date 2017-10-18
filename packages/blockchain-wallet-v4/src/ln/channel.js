import {CommitmentSigned, OpenChannel, RevokeAndAck, UpdateAddHtlc} from './messages/serializer'
import * as random from 'crypto'
import assert from 'assert'
import {ChannelParams, ChannelUpdateTypes, ChannelUpdateWrapper, Direction, Payment, PaymentWrapper} from './state'

import {List, fromJS} from 'immutable'

const ec = require('../../../bcoin/lib/crypto/secp256k1-browser')
const Long = require('long')

export let phase = {
  SENT_OPEN: 1,
  SENT_FUNDING_CREATED: 2,
  FUNDING_CONFIRMING: 3,
  SENT_FUNDING_LOCKED: 4,
  OPEN: 5
}

var createKey = () => {
  let key = {}
  key.priv = random.randomBytes(32)
  key.pub = ec.publicKeyCreate(key.priv, true)
  return fromJS(key)
}

var wrapPubKey = (pub) => fromJS({pub, priv: null})

let checkChannel = (channel, phase) => {
  assert(channel !== undefined)
  assert(channel.phase === phase)
}

let getChannel = (state, channelId) => state.getIn(['channels', channelId])
let getChannelCheck = (state, channelId, phase) => checkChannel(getChannel(state, channelId), phase)

export function openChannel (state, peer, options, channel) {
  let channelId = random.randomBytes(32) // TODO

  let paramsLocal = ChannelParams(
    createKey(),
    options.dustLimitSatoshis,
    options.maxHtlcValueInFlightMsat,
    options.channelReserveSatoshis,
    options.htlcMinimumMsat,
    options.toSelfDelay,
    options.maxAcceptedHtlcs,
    createKey(),
    createKey(),
    createKey(),
    options.gf,
    options.lf)

  let open = OpenChannel(
    options.chainHash,
    channel.channelId,
    channel.amountMsatLocal.div(1000).value,
    channel.amountMsatRemote,
    paramsLocal.dustLimitSatoshis,
    channel.amountMsatLocal.div(1000).value,
    new Long(0),
    new Long(0),
    paramsLocal.feeratePerKw,
    paramsLocal.toSelfDelay,
    paramsLocal.maxAcceptedHtlcs,
    paramsLocal.fundingKey.pub,
    paramsLocal.revocationBasepoint.pub,
    paramsLocal.paymentBasepoint.pub,
    paramsLocal.delayedPaymentBasepoint.pub,
    paramsLocal.firstPerCommitmentPoint.pub,
    Buffer.alloc(1)
  )

  channel = channel
    .set('staticRemote', peer.staticRemote)
    .set('channelId', channelId)
    .set('paramsLocal', paramsLocal)
    .set('phase', phase.SENT_OPEN)
    .update('messageOut', (l) => l.push(open))

  state = state.setIn(['channels', channelId], channel)

  return state
}

export function readAcceptChannel (msg, state, peer) {
  let channel = getChannelCheck(state, msg.channelId, phase.SENT_OPEN)

  let paramsRemote = ChannelParams(
    wrapPubKey(msg.fundingPubkey),
    msg.dustLimitSatoshis,
    msg.maxHtlcValueInFlightMsat,
    msg.channelReserveSatoshis,
    msg.htlcMinimumMsat,
    msg.toSelfDelay,
    msg.maxAcceptedHtlcs,
    wrapPubKey(msg.revocationBasepoint),
    wrapPubKey(msg.paymentBasepoint),
    wrapPubKey(msg.delayedPaymentBasepoint),
    wrapPubKey(msg.revocationBasepoint),
    peer.gf,
    peer.lf)

  return channel
    .set('paramsRemote', paramsRemote)
    .set('minimumDepth', msg.minimumDepth)
}

export function sendFundingCreated (channelId, state, wallet) {

}

let reverseWrapper = (wrapper) => {
  return wrapper.update('direction', (d) => {
    if (d === Direction.OFFERED) {
      return Direction.RECEIVED
    } else {
      return Direction.OFFERED
    }
  })
}

let getPaymentI = (state, id) => state.getIn(['payments', 'mapI', id])
let getPaymentO = (state, id) => state.getIn(['payments', 'mapO', id])

let filterPayment = (id) => { return a => { return a !== id } }
let wrapPayment = (msg, direction) => PaymentWrapper(direction, msg.id, Payment(msg.amountMsat, msg.paymentHash, msg.onionRoutingPackage, msg.cltvTimeout))

let applyAdd = (channelState, msg, direction) => {
  // A new payment is added to the channelState
  // We need to remove balance and add it to the commitment tx
  if (direction === Direction.RECEIVED) {
    return channelState
      .update('amountMsatRemote', a => a.sub(msg.amountMsat))
      .update('committed', a => a.push(wrapPayment(msg, direction)))
  } else {
    return channelState
      .update('amountMsatLocal', a => a.sub(msg.amountMsat))
      .update('committed', a => a.push(wrapPayment(msg, direction)))
  }
}

let applyFulfill = (channelState, msg, direction) => {
  // This payment got successfully resolved
  // We credit our balance with the amount of the payment and
  // remove it from the commitment tx
  // TODO need to save the secret somewhere
  if (direction === Direction.RECEIVED) {
    let payment = getPaymentO(channelState, msg.id)
    return channelState
      .update('amountMsatRemote', a => a.add(payment.get('amount')))
      .update('committed', filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    return channelState
      .update('amountMsatLocal', a => a.add(payment.get('amount')))
      .update('committed', filterPayment(msg.id))
  }
}

let applyFail = (channelState, msg, direction) => {
  // This payment failed, this means we need to credit our balance with
  // the amount of this payment again and remove it from the commitment tx
  if (direction === Direction.RECEIVED) {
    let payment = getPaymentO(channelState, msg.id)
    return channelState
      .update('amountMsatLocal', a => a.add(payment.get('amount')))
      .updateIn(['committed', 'o'], filterPayment(msg.id))
  } else {
    let payment = getPaymentI(channelState, msg.id)
    return channelState
      .update('amountMsatRemote', a => a.add(payment.get('amount')))
      .updateIn(['committed', 'i'], filterPayment(msg.id))
  }
}

// TODO do we need to handle this case much differently?
let applyMalformed = (channelState, fail, direction) => applyFail(channelState, fail, direction)

let applyWrapper = (channelState, wrapper) => {
  let {type, direction, msg} = wrapper.toJS()

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

let fillStaged = (channelState) => {
  return channelState
    .set('staged', List())
    .update('staged', l => l.push(...channelState.get('ack')))
    .update('staged', l => l.push(...channelState.get('unack')))
    .set('ack', List())
    .set('unack', List())
}

let localIndexPath = ['local', 'indexes', 'inU']
let remoteIndexPath = ['local', 'indexes', 'inU']
let getLocalIndex = (c) => c.getIn(localIndexPath)
let getRemoteIndex = (c) => c.getIn(remoteIndexPath)
let incrementLocalIndex = (c) => c.updateIn(localIndexPath, i => i.add(1))
let incrementRemoteIndex = (c) => c.updateIn(remoteIndexPath, i => i.add(1))

let addMessage = (msg) => { return state => state.updateIn(['messageOut'], o => o.push(msg)) }
let updateChannel = (state, channelId, channel) => state.updateIn(['channels'], o => o.set(channelId, channel))

export function createUpdateAddHtlc (channelId, state, payment) {
  let channel = getChannel(state, channelId)
    .update(incrementLocalIndex)

  // TODO check if we actually have enough money to make this payment
  let paymentIndex = getLocalIndex(channel)

  let msg = UpdateAddHtlc(
    channelId,
    paymentIndex,
    payment.get('amount'),
    payment.get('paymentHash'),
    payment.get('cltvTimeout'),
    payment.get('onionRoutingPackage'))

  channel = channel
    .updateIn(['remote', 'unack'], l => l.push(ChannelUpdateWrapper(ChannelUpdateTypes.ADD, Direction.RECEIVED, msg)))
    .update(addMessage(msg))

  return updateChannel(state, channelId, channel)
}

export let onUpdateAddHtlc = (state, msg) => {
  let channel = getChannel(state, msg.channelId)
    .update(incrementRemoteIndex)
    .updateIn(['local', 'unack'], l => l.push(ChannelUpdateWrapper(ChannelUpdateTypes.ADD, Direction.RECEIVED, msg)))

  // TODO check index
  // assert.deepEqual(msg.id, channel.remote.indexes.inU.add(1))
  // TODO check amount
  // TODO go through staged payments and calculate there are enough funds

  return updateChannel(state, msg.channelId, channel)
}

export function createCommitmentSigned (channelId, state) {
  let channel = getChannel(state, channelId)
  let channelState = channel.get('remote')
    .update(fillStaged)

  let channelStateComm = channelState
    .update(s => applyWrapperList(channelState.get('staged'), s))

  let paymentList = channelStateComm.get('committed')
  // TODO prune payment list
  // TODO create commitment transaction
  // TODO sign commitment transaction
  // TODO sign payment transactions

  let msg = CommitmentSigned(channelId, null, 0, null)

  channel = channel
    .set('remote', channelState)
    .update(addMessage(msg))
  return updateChannel(state, channelId, channel)
}

export function onCommitmentSigned (state, msg) {
  let channel = getChannel(state, msg.channelId)
  let channelState = channel.get('local')
    .update(fillStaged)
  // We received a commitment message from the other party
  // We need to apply all the local diffs

  let channelStateComm = channelState
    .update(s => applyWrapperList(channelState.get('staged'), s))

  let paymentList = channelStateComm.get('committed')
  // TODO create commitment transaction
  // TODO check commitment signature

  return updateChannel(state, msg.channelId,
    channel.set('local', channelState))
}

export function createRevokeAck (channelId, state) {
  let channel = getChannel(state, channelId)

  // We are permanently committing to the new state by revoking the old state
  // After sending this message, the comm list will be merged to the committed list
  channel.local = applyWrapper(channel.local, channel.local.staged)

  channel.messageOut.push(RevokeAndAck(channelId, null, null))
  return state
}

export function onRevokeAck (state, msg) {
  let channel = getChannel(state, msg.channelId)

  // TODO check commitments and compact our commitment store

  channel.local = applyWrapper(channel.remote, channel.remote.staged)

  return state
}
