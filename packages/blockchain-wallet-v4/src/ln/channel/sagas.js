import * as AT from './actionTypes'
import { takeEvery, call, put, select } from 'redux-saga/effects'
import {
  createCommitmentSigned,
  createFundingCreated, createOpenChannel, createRevokeAck,
  readAcceptChannel, readCommitmentSigned, readFundingSigned, readRevokeAck,
  readUpdateAddHtlc
} from './channel'
import {refresh} from './actions'
import {copy} from '../helper'
import TYPE from '../messages/types'
import {sendMessage} from '../peers/actions'
import {Connection} from '../peers/connection'

export const channelSagas = (tcpConn) => {
  const getChannelId = msg => {
    if (msg.channelId !== undefined) {
      return msg.channelId
    } else if (msg.temporaryChannelId !== undefined) {
      return msg.temporaryChannelId
    } else {
      throw Error('Message doesnt have channelId defined ' + msg)
    }
  }
  const getChannel = channelId => state => state.ln.channel[channelId]

  const onOpen = function * ({options}) {
    console.info('ON_OPEN')
    const staticRemote = options.staticRemote

    // yield call(tcpConn.connectToNodePromise.bind(tcpConn), staticRemote)

    const conn = new Connection(options, staticRemote)
    yield call(conn.connectPromise.bind(conn), tcpConn)

    // TODO initiate handshake and wait for completion
    let response = createOpenChannel(staticRemote, options, options.value)

    yield put(sendMessage(staticRemote, response.msg))
    yield put(refresh(response.channel))
  }

  const onMessage = function * ({peer, msg}) {
    let channel = yield select(getChannel(getChannelId(msg)))
    let response
    channel = copy(channel)

    switch (msg.type) {
      case TYPE.ACCEPT_CHANNEL:
        channel = readAcceptChannel(channel, msg, peer)
        response = createFundingCreated(channel, undefined)
        break

      case TYPE.FUNDING_SIGNED:
        channel = readFundingSigned(channel, msg)
        // TODO send action for broadcasting transaction
        break

      case TYPE.UPDATE_ADD_HTLC:
        channel = readUpdateAddHtlc(channel, msg)
        // TODO probably not the best to send commitments every time..
        response = createCommitmentSigned(channel)
        break

      case TYPE.COMMITMENT_SIGNED:
        channel = readCommitmentSigned(channel, msg)
        response = createRevokeAck(channel)
        break

      case TYPE.REVOKE_AND_ACK:
        channel = readRevokeAck(channel, msg)
        // TODO not sure, I think sometimes we want to send back a commitment signed message after this
        break

      case TYPE.ANNOUNCEMENT_SIGNATURES:
      case TYPE.CHANNEL_ANNOUNCEMENT:
      case TYPE.NODE_ANNOUNCEMENT:
      case TYPE.CHANNEL_UPDATE:
        break

      default: throw new Error('No message handler for ' + JSON.stringify(msg))
    }

    if (response !== undefined) {
      channel = response.channel

      // TODO should this be a direct call or a put?
      yield put(sendMessage(channel.staticRemote, response.msg))
    }

    yield put(refresh(channel))
  }

  // TODO how do we wire up the sagas?
  return function * () {
    yield takeEvery(AT.OPEN, onOpen)
    yield takeEvery(AT.MESSAGE, onMessage)
  }
}
