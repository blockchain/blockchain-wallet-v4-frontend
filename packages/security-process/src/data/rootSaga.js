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
