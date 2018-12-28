import { fork } from 'redux-saga/effects'
import bch from './bch/sagaRegister'
import btc from './btc/sagaRegister'
import eth from './eth/sagaRegister'
import xlm from './xlm/sagaRegister'
import rates from './rates/sagaRegister'
import publicRates from './publicRates/sagaRegister'

export default ({
  api,
  bchSocket,
  btcSocket,
  ethSocket,
  ratesSocket,
  publicRatesSocket
}) =>
  function*() {
    yield fork(bch({ api, bchSocket }))
    yield fork(btc({ api, btcSocket }))
    yield fork(eth({ api, ethSocket }))
    yield fork(xlm())
    yield fork(rates({ api, ratesSocket }))
    yield fork(publicRates({ api, ratesSocket: publicRatesSocket }))
  }
