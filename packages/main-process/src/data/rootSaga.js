import { all, fork } from 'redux-saga/effects'
import { coreSagasFactory, coreRootSagaFactory } from 'blockchain-wallet-v4/src'
import alerts from './alerts/sagaRegister'
import analytics from './analytics/sagaRegister'
import auth from './auth/sagaRegister'
import components from './components/sagaRegister'
import middleware from './middleware/sagaRegister'
import modules from './modules/sagaRegister'
import preferences from './preferences/sagaRegister'
import goals from './goals/sagaRegister'
import router from './router/sagaRegister'
import wallet from './wallet/sagaRegister'

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
    fork(middleware({ ...args, coreSagas })),
    fork(coreRootSagaFactory({ ...args, coreSagas })),
    fork(router({ ...args, coreSagas }))
  ])
}
