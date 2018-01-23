import * as AT from './actionTypes'
import * as AT_WS from '../../redux/webSocket/actionTypes'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import {
  phase,
  createCommitmentSigned,
  createFundingCreated, createOpenChannel, createRevokeAck,
  readAcceptChannel, readCommitmentSigned, readFundingSigned, readRevokeAck,
  readUpdateAddHtlc, createFundingLocked, readFundingLocked
} from './channel'
import {opened, refresh} from './actions'
import {copy, wrapHex, wrapPubKey} from '../helper'
import TYPE from '../messages/types'
import {sendMessage} from '../peers/actions'
import {getChannelDir, getChannel} from './selectors'

const Long = require('long')

let options = {
  chainHash: Buffer.from('000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943', 'hex').reverse(),
  dustLimitSatoshis: Long.fromNumber(546),
  maxHtlcValueInFlightMsat: Long.fromNumber(100000),
  channelReserveSatoshis: Long.fromNumber(1000),
  feeRatePerKw: 10000,
  htlcMinimumMsat: 1,
  toSelfDelay: 60,
  maxAcceptedHtlcs: 100
}

export const channelSagas = (api, peersSaga) => {
  const getChannelId = msg => {
    if (msg.channelId !== undefined) {
      return msg.channelId
    } else if (msg.temporaryChannelId !== undefined) {
      return msg.temporaryChannelId
    } else {
      throw Error('Message doesnt have channelId defined ' + msg)
    }
  }

  const onOpenChannel = function * ({publicKey, value}) {
    yield call(peersSaga.connect, {publicKey})
    yield call(openChannel, ({options, publicKey, value}))
  }

  const openChannel = function * ({options, publicKey, value}) {
    // Opening the channel
    const staticRemote = wrapPubKey(wrapHex(publicKey))

    let response = createOpenChannel(staticRemote, options, value)

    yield put(sendMessage(wrapHex(publicKey), response.msg))
    yield put(refresh(response.channel))
  }

  const onBlock = function * () {
    let channels = yield select(getChannelDir)

    for (const channelId in channels) {
      const channel = channels[channelId]

      if (channel.phase === phase.FUNDING_BROADCASTED || channel.phase === phase.SENT_FUNDING_LOCKED) {
        // TODO get confirmations
        const confirmations = 5

        if (confirmations >= channel.paramsLocal.minimumDepth) {
          let response = createFundingLocked(channel)

          yield put(sendMessage(channel.staticRemote, response.msg))
          yield put(refresh(response.channel))
          yield call(checkChannelOpen, channel)
        }
      }
      // TODO add other checks for existing channels here
    }
  }

  const onMessage = function * ({peer, msg}) {
    if (
      msg.type === TYPE.ANNOUNCEMENT_SIGNATURES ||
      msg.type === TYPE.CHANNEL_ANNOUNCEMENT ||
      msg.type === TYPE.NODE_ANNOUNCEMENT ||
      msg.type === TYPE.CHANNEL_UPDATE
    ) {
      return
    }

    let channel = yield select(getChannel(getChannelId(msg).toString('hex')))
    let response
    channel = copy(channel)

    switch (msg.type) {
      case TYPE.ACCEPT_CHANNEL:
        channel = readAcceptChannel(channel, msg, peer)
        response = createFundingCreated(channel, undefined)
        break

      case TYPE.FUNDING_SIGNED:
        channel = readFundingSigned(channel, msg)
        yield call(api.pushTx, channel.fundingTx.toString('hex'))
        break

      case TYPE.FUNDING_LOCKED:
        channel = readFundingLocked(channel, msg)
        yield call(checkChannelOpen, channel)
        break

      case TYPE.UPDATE_ADD_HTLC:
        channel = readUpdateAddHtlc(channel, msg)
        break

      case TYPE.COMMITMENT_SIGNED:
        channel = readCommitmentSigned(channel, msg)
        response = createRevokeAck(channel)
        break

      case TYPE.REVOKE_AND_ACK:
        channel = readRevokeAck(channel, msg)
        if (channel.local.ack.length + channel.local.unack.length > 0) {
          response = createCommitmentSigned(channel)
        }
        break

      default: throw new Error('No message handler for ' + JSON.stringify(msg))
    }

    if (response !== undefined) {
      channel = response.channel
      yield put(sendMessage(channel.staticRemote.pub, response.msg))
    }

    yield put(refresh(channel))
  }

  const checkChannelOpen = function * (channel) {
    if (channel.fundingLockedSent && channel.fundingLockedReceived) {
      yield put(opened(channel.channelId))
    }
  }

  const takeSagas = function * () {
    yield takeEvery(AT.OPEN, onOpenChannel)
    yield takeEvery(AT.MESSAGE, onMessage)
    yield takeEvery(AT_WS.ON_BLOCK, onBlock)
  }

  return {
    takeSagas
  }
}
