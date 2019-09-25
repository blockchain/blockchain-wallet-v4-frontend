import { all, call, delay, fork, put } from 'redux-saga/effects'
import { coreSagasFactory, coreRootSagaFactory } from 'blockchain-wallet-v4/src'
import * as actions from './actions'
import alerts from './alerts/sagaRegister'
import analytics from './analytics/sagaRegister'
import auth from './auth/sagaRegister'
import components from './components/sagaRegister'
import modules from './modules/sagaRegister'
import preferences from './preferences/sagaRegister'
import goals from './goals/sagaRegister'
import router from './router/sagaRegister'
import wallet from './wallet/sagaRegister'
import { tryParseLanguageFromUrl } from 'services/LocalesService'

const logLocation = 'data/rootSaga'

const welcomeSaga = function * () {
  try {
    const version = APP_VERSION
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

const languageInitSaga = function * ({ imports }) {
  try {
    yield delay(250)
    const lang = tryParseLanguageFromUrl(imports)
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

export default function * rootSaga (args) {
  const coreSagas = coreSagasFactory(args)

  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(analytics({ ...args, coreSagas })),
    fork(auth({ ...args, coreSagas })),
    fork(components({ ...args, coreSagas })),
    fork(modules({ ...args, coreSagas })),
    fork(preferences({ ...args, coreSagas })),
    fork(goals({ ...args, coreSagas })),
    fork(wallet({ ...args, coreSagas })),
    fork(coreRootSagaFactory({ ...args, coreSagas })),
    fork(router({ ...args, coreSagas })),
    call(languageInitSaga, { ...args, coreSagas })
  ])
}
