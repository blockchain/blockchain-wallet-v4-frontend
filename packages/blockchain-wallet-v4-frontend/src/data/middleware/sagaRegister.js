import { fork } from 'redux-saga/effects'
import webSocket from './webSocket/sagaRegister'

export default ({ api, bchSocket, btcSocket, ethSocket }) => function * () {
  yield fork(webSocket({ api, bchSocket, btcSocket, ethSocket }))
}
