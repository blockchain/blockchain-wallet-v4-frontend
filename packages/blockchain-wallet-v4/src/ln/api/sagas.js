import * as A from './actions'
import * as AT from './actionTypes'

import {takeEvery} from 'redux-saga'

// TODO connect with other sagas
export const lnApiSagas = (channelSagas, peerSagas) => {
  const startUp = function * () {

  }

  const openChannel = function * () {

  }

  const closeChannel = function * () {

  }

  const send = function * () {

  }

  const receive = function * () {

  }

  const takeSagas = function * () {
    yield takeEvery(AT.STARTUP, startUp)
    yield takeEvery(AT.OPEN_CHANNEL, openChannel)
    yield takeEvery(AT.CLOSE_CHANNEL, closeChannel)
    yield takeEvery(AT.RECEIVE, receive)
    yield takeEvery(AT.SEND, send)
    yield takeEvery(AT.RECEIVE, receive)
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
