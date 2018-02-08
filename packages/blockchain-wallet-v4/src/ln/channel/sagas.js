import * as AT from './actionTypes'
import * as AT_WS from '../../redux/webSocket/actionTypes'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import {
  phase,
  createCommitmentSigned,
  createFundingCreated, createOpenChannel, createRevokeAck,
  readAcceptChannel, readCommitmentSigned, readFundingSigned, readRevokeAck,
  readUpdateAddHtlc, createFundingLocked, readFundingLocked, createFundingOutput, createUpdateAddHtlc
} from './channel'
import {opened, refresh} from './actions'
import {copy, wrapHex, wrapPubKey} from '../helper'
import TYPE from '../messages/types'
import {sendMessage} from '../peers/actions'
import {getChannelDir, getChannel} from './selectors'
import {rootOptions} from '../root/selectors'
import {getTransactionHash} from './transactions'
import {peerStaticRemote} from '../peers/selectors'

export const channelSagas = (api, wallet, peersSaga, routeSaga) => {
  const getChannelId = msg => {
    if (msg.channelId !== undefined) {
      return msg.channelId
    } else if (msg.temporaryChannelId !== undefined) {
      return msg.temporaryChannelId
    } else {
      throw Error('Message doesnt have channelId defined ' + msg)
    }
  }

  const sendOpenChannel = function * ({options, pubKey, value}) {
    // Opening the channel
    const key = wrapPubKey(pubKey)
    let response = createOpenChannel(key, options, value)

    yield put(refresh(response.channel))
    yield put(sendMessage(pubKey, response.msg))

    return response.channel.channelId
  }

  const closeChannelMutual = function * ({channelId}) {

  }

  const closeChannelUnilateral = function * ({channelId}) {

  }

  const onBlock = function * ({block}) {
    let channels = yield select(getChannelDir)

    for (const channelId in channels) {
      const channel = channels[channelId]

      if (channel.phase === phase.FUNDING_BROADCASTED) {
        let rawTx = yield call(api.getRawTx, getTransactionHash(channel.fundingTx).toString('hex'))
        const confirmations = block.height - rawTx.block_height

        if (confirmations >= channel.paramsLocal.minimumDepth) {
          let response = createFundingLocked(channel)

          yield put(sendMessage(channel.keyRemote.pub, response.msg))
          yield put(refresh(response.channel))
          yield call(checkChannelOpen, channel)
        }
      }
      // TODO add other checks for existing channels here
    }
  }

  const makePayment = function * (paymentRequest) {
    // TODO which channel do we chose to route this payment with?
    const route = yield call(routingEndpoint)
    const onionObject = calculateOnionObject(route)
    const channelId = yield call(getNodeForPayment, paymentRequest.amount)
    const channel = yield select(getChannel(channelId))

    let response1 = createUpdateAddHtlc(channel, paymentRequest)
    let response2 = createCommitmentSigned(response1.channel)

    yield put(refresh(response2.channel))
    yield put(sendMessage(channel.keyRemote.pub, response1.msg))
    yield put(sendMessage(channel.keyRemote.pub, response2.msg))
  }

  const getNodeForPayment = function * (amount) {
    const channels = yield select(getChannelDir)

    // Which of our channels has enough funds to make this payment?
    for (const channelId in channels) {
      const channel = channels[channelId]
      if (channel.stateLocal.amountMsatLocal > amount) {
        // Check if we have a connection to the peer currently
        const pubKeyHex = channel.keyRemote.pub.toString('hex')
        const peers = yield (peerStaticRemote)
        const peer = peers[pubKeyHex]
        if (peer.connected) {
          return channelId
        }
      }
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

        const output = createFundingOutput(channel)
        channel.fundingTx = yield call(wallet.send, [output], 10)

        response = createFundingCreated(channel)
        break

      case TYPE.FUNDING_SIGNED:
        channel = readFundingSigned(channel, msg)
        yield call(api.pushTx, channel.fundingTx.toString('hex'))
        console.info('Broadcasted funding tx ' + getTransactionHash(channel.fundingTx).toString('hex'))
        channel.phase = phase.FUNDING_BROADCASTED
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
        if (channel.stateLocal.ack.length + channel.stateLocal.unack.length > 0) {
          response = createCommitmentSigned(channel)
        }
        break

      default:
        console.info('No message handler for ', msg)
        return
    }

    if (response !== undefined) {
      channel = response.channel
      yield put(sendMessage(channel.keyRemote.pub, response.msg))
    }

    yield put(refresh(channel))
  }

  const checkChannelOpen = function * (channel) {
    if (channel.fundingLockedSent && channel.fundingLockedReceived) {
      yield put(opened(channel.channelId))
    }
  }

  const takeSagas = function * () {
    yield takeEvery(AT.MESSAGE, onMessage)
    yield takeEvery(AT_WS.ON_BLOCK, onBlock)
  }

  return {
    takeSagas,
    sendOpenChannel,
    closeChannelMutual,
    closeChannelUnilateral,
    onMessage,
    onBlock
  }
}
