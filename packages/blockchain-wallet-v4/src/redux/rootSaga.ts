import { all, fork } from 'redux-saga/effects'

import data from './data/sagaRegister'
import kvStore from './kvStore/sagaRegister'
import settings from './settings/sagaRegister'
import wallet from './wallet/sagaRegister'
import walletOptions from './walletOptions/sagaRegister'

export default ({ api, networks, options }) =>
  function * coreSaga() {
    yield all([
      fork(data({ api, networks })),
      fork(kvStore({ api, networks })),
      fork(walletOptions({ options })),
      fork(settings({ api })),
      fork(wallet({ api, networks }))
    ])
  }
