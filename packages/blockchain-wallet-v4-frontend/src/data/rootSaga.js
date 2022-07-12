import { all, call, fork, put } from 'redux-saga/effects'

import { coreRootSagaFactory, coreSagasFactory } from '@core'
import { actions } from 'data'
import miscSagas from 'data/misc/sagas'

import alerts from './alerts/sagaRegister'
import analytics from './analytics/sagaRegister'
import auth from './auth/sagaRegister'
import components from './components/sagaRegister'
import custodial from './custodial/sagaRegister'
import goals from './goals/sagaRegister'
import middleware from './middleware/sagaRegister'
import misc from './misc/sagaRegister'
import modules from './modules/sagaRegister'
import preferences from './preferences/sagaRegister'
import prices from './prices/sagaRegister'
import router from './router/sagaRegister'
import session from './session/sagaRegister'
import signup from './signup/sagaRegister'
import wallet from './wallet/sagaRegister'

export default function* rootSaga({ api, coinsSocket, networks, options, ratesSocket }) {
  const coreSagas = coreSagasFactory({ api, networks, options })
  const { initAppLanguage, logAppConsoleWarning, pingManifestFile } = miscSagas()

  yield all([
    put(actions.core.data.coins.pollForCoinData()),
    call(logAppConsoleWarning),
    fork(analytics),
    fork(alerts),
    fork(auth({ api, coreSagas, networks })),
    fork(components({ api, coreSagas, networks, options })),
    fork(custodial({ api, coreSagas, networks })),
    fork(misc()),
    fork(modules({ api, coreSagas, networks })),
    fork(preferences()),
    fork(prices({ api })),
    fork(goals({ api, coreSagas, networks })),
    fork(wallet({ api, coreSagas })),
    fork(middleware({ api, coinsSocket, ratesSocket })),
    fork(coreRootSagaFactory({ api, networks, options })),
    fork(router()),
    fork(session({ api })),
    fork(signup({ api, coreSagas, networks })),
    call(pingManifestFile),
    call(initAppLanguage)
  ])
}
