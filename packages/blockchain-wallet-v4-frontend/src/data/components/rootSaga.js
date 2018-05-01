import { all, fork } from 'redux-saga/effects'

import exchange from './exchange/rootSaga'
import importBtcAddress from './importBtcAddress/rootSaga'
import priceChart from './priceChart/rootSaga'
import priceTicker from './priceTicker/rootSaga'
import sendBch from './sendBch/rootSaga'
import sendBtc from './sendBtc/rootSaga'
import sendEth from './sendEth/rootSaga'
import signMessage from './signMessage/rootSaga'
import usedAddresses from './usedAddresses/rootSaga'


export default ({ api, coreSagas }) => function * () {
  yield fork(exchange({ api, coreSagas })),
  yield fork(importBtcAddress({ api, coreSagas })),
  yield fork(priceChart({ coreSagas }))
  yield fork(priceTicker({ coreSagas })),
  yield fork(sendBch({ api, coreSagas })),
  yield fork(sendBtc({ api, coreSagas })),
  yield fork(sendEth({ api, coreSagas })),
  yield fork(signMessage({ coreSagas })),
  yield fork(usedAddresses({ coreSagas }))
}
