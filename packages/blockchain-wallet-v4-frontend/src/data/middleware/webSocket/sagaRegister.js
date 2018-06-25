import { fork } from 'redux-saga/effects'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'

export default ({ api, bchSocket, btcSocket, ethSocket }) => function * () {
  yield fork(bch({ api, bchSocket }))
  yield fork(btc({ api, btcSocket }))
  yield fork(eth({ api, ethSocket }))
}
