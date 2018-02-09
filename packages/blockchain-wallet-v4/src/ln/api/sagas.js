import * as A from './actions'
import * as AT from './actionTypes'
import * as AT_CHANNEL from '../channel/actionTypes'
import * as A_SOCKET from '../tcprelay/actions'
import * as AT_SOCKET from '../tcprelay/actionTypes'

import * as A_OPTIONS from '../root/actions'

import { take, takeEvery, call, put, select } from 'redux-saga/effects'
import {rootOptions} from '../root/selectors'

export const lnApiSagas = (channelSagas, peerSagas, routeSagas) => {

  const startUp = function * () {
    const action = A.startup
    try {
      yield put(A_OPTIONS.startUp())
      yield put(A_SOCKET.startSocket())
      console.info('wait for socket to open..')
      yield take(AT_SOCKET.SOCKET_OPENED)
      console.info('socket opened..')
      yield put(action.SUCCESS())
    } catch (e) {
      yield put(action.ERROR(e))
    }
  }

  const openChannel = function * ({pubKey, value}) {
    const action = A.openChannel
    try {
      const options = yield select(rootOptions)
      yield call(peerSagas.connect, {pubKey})
      const temporaryChannelId = yield call(channelSagas.sendOpenChannel, ({options, pubKey, value}))

      while (true) {
        const broadcastedAction = yield take(AT_CHANNEL.BROADCASTED)
        if (temporaryChannelId.equals(broadcastedAction.temporaryChannelId)) {
          yield put(action.SUCCESS(), broadcastedAction.channelId)
          return
        }
      }
    } catch (e) {
      console.info(e)
      yield put(action.ERROR(e))
    }
  }

  const closeChannel = function * ({channelId}) {
    const action = A.closeChannel
    try {
      // TODO check if the peer is currently connected, otherwise close unilaterally
      const connected = true
      if (connected) {
        yield call(channelSagas.closeChannelMutual, channelId)
      } else {
        yield call(channelSagas.closeChannelUnilateral, channelId)
      }

      // TODO we will not wait until the closing transaction is confirmed here, probably need more actions dispatched
      yield put(action.SUCCESS)
    } catch (e) {
      yield put(action.ERROR, e)
    }
  }

  const send = function * ({address, value}) {
    const action = A.send
    try {
      // const route = yield call(routingEndpoint)
      const route = [Buffer.alloc(33), Buffer.alloc(33)]
      const onionObject = calculateOnionObject(route)
      const channelId = yield call(getNodeForPayment, paymentRequest.amount)
      const channel = yield select(getChannel(channelId))

      let response1 = createUpdateAddHtlc(channel, paymentRequest)
      let response2 = createCommitmentSigned(response1.channel)

      yield put(refresh(response2.channel))
      yield put(sendMessage(channel.keyRemote.pub, response1.msg))
      yield put(sendMessage(channel.keyRemote.pub, response2.msg))

      yield put(action.SUCCESS)
    } catch (e) {
      yield put(action.ERROR, e)
    }
  }

  const receive = function * () {
    const action = A.receive
    try {
      yield put(action.SUCCESS)
    } catch (e) {
      yield put(action.ERROR, e)
    }
  }

  const takeSagas = function * () {
    yield takeEvery(AT.STARTUP.EVENT, startUp)
    yield takeEvery(AT.OPEN_CHANNEL.EVENT, openChannel)
    yield takeEvery(AT.CLOSE_CHANNEL.EVENT, closeChannel)
    yield takeEvery(AT.RECEIVE.EVENT, receive)
    yield takeEvery(AT.SEND.EVENT, send)
    yield takeEvery(AT.RECEIVE.EVENT, receive)
  }

  return {
    takeSagas,
    startUp,
    openChannel,
    closeChannel,
    send,
    receive
  }
}
