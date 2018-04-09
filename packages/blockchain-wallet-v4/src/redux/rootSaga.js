import { all, fork } from 'redux-saga/effects'
import dataBitcoin from './data/bitcoin/rootSaga'
import dataCoinify from './data/coinify/rootSaga'
import dataEthereum from './data/ethereum/rootSaga'
import dataBch from './data/bch/rootSaga'
import dataMisc from './data/misc/rootSaga'
import dataSfox from './data/sfox/rootSaga'
import dataShapeShift from './data/shapeShift/rootSaga'
import kvStoreBch from './kvStore/bch/rootSaga'
import kvStoreBuysell from './kvStore/buySell/rootSaga'
import kvStoreContacts from './kvStore/contacts/rootSaga'
import kvStoreEthereum from './kvStore/ethereum/rootSaga'
import kvStoreShapeshift from './kvStore/shapeShift/rootSaga'
import kvStoreWhatsnew from './kvStore/whatsNew/rootSaga'
import walletOptions from './walletOptions/rootSaga'
import settings from './settings/rootSaga'

export default ({ api, socket, options }) => function * () {
  yield all([
    fork(dataBitcoin({ api })),
    // fork(dataCoinify({ api, coinifyService })),
    fork(dataEthereum({ api })),
    fork(dataBch({ api })),
    fork(dataMisc({ api })),
    // fork(dataSfox({ api, sfoxService })),
    fork(dataShapeShift({ api })),
    fork(kvStoreBch({ api })),
    fork(kvStoreBuysell({ api })),
    fork(kvStoreContacts({ api })),
    fork(kvStoreEthereum({ api })),
    fork(kvStoreShapeshift({ api })),
    fork(kvStoreWhatsnew({ api })),
    fork(walletOptions({ api, options })),
    fork(settings({ api }))
  ])
}
