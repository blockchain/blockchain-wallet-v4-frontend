import { all, call, delay, fork, put } from 'redux-saga/effects'

import { coreRootSagaFactory, coreSagasFactory } from 'blockchain-wallet-v4/src'
import { tryParseLanguageFromUrl } from 'services/locales'

import * as actions from './actions'
import alerts from './alerts/sagaRegister'
import analytics from './analytics/sagaRegister'
import auth from './auth/sagaRegister'
import components from './components/sagaRegister'
import custodial from './custodial/sagaRegister'
import goals from './goals/sagaRegister'
import middleware from './middleware/sagaRegister'
import modules from './modules/sagaRegister'
import preferences from './preferences/sagaRegister'
import prices from './prices/sagaRegister'
import router from './router/sagaRegister'
import wallet from './wallet/sagaRegister'

const logLocation = 'data/rootSaga'

const welcomeSaga = function* () {
  try {
    const version = window.APP_VERSION
    const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
    const style2 = 'font-size: 18px;'
    /* eslint-disable */
    console.log('=======================================================')
    console.log(`%c Wallet version ${version}`, style2)
    console.log('=======================================================')
    console.log('%c STOP!!', style1)
    console.log('%c This browser feature is intended for developers.', style2)
    console.log('%c If someone told you to copy-paste something here,', style2)
    console.log(
      '%c it is a scam and will give them access to your money!',
      style2
    )
    /* eslint-enable */
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'welcomeSaga', e))
  }
}

const languageInitSaga = function* () {
  try {
    yield delay(250)
    const lang = tryParseLanguageFromUrl()
    if (lang.language) {
      yield put(actions.preferences.setLanguage(lang.language, false))
      if (lang.cultureCode) {
        yield put(actions.preferences.setCulture(lang.cultureCode))
      }
    }
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'languageInitSaga', e))
  }
}

export default function* rootSaga({ api, coinsSocket, networks, options, ratesSocket }) {
  const coreSagas = coreSagasFactory({ api, networks, options })
  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(analytics()),
    fork(auth({ api, coreSagas })),
    fork(components({ api, coreSagas, networks, options })),
    fork(custodial({ api, coreSagas, networks })),
    fork(modules({ api, coreSagas, networks })),
    fork(preferences()),
    fork(prices({ api })),
    fork(goals({ api, coreSagas, networks })),
    fork(wallet({ api, coreSagas })),
    fork(middleware({ api, coinsSocket, ratesSocket })),
    fork(coreRootSagaFactory({ api, networks, options })),
    fork(router()),
    call(languageInitSaga)
  ])
}
