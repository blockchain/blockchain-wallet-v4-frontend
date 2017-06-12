import { createStore, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import persistState from 'redux-localstorage'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import Immutable from 'immutable-ext'
import { is } from 'ramda'
import { coreMiddleware } from 'dream-wallet/lib'

import autoDisconnectionMiddleware from '../middleware/autoDisconnectionMiddleware.js'
import rootSaga from '../data/rootSaga.js'
import rootReducer from '../data/rootReducer.js'
import settings from 'config'
import { api } from 'services/walletApi.js'
// import { Socket } from 'dream-wallet/lib/network'
import { auth } from 'data/rootSelectors.js'
import { Wrapper, Wallet, Address, HDWallet, HDAccount } from 'dream-wallet/lib/types'

const configureStore = () => {
  const history = createBrowserHistory()
  const sagaMiddleware = createSagaMiddleware()
  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: { immutable: Immutable } }) : compose
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
    {
      // features: {
      //   pause: true, // start/pause recording of dispatched actions
      //   lock: true, // lock/unlock dispatching actions and side effects    
      //   persist: true, // persist states on page reloading
      //   export: true, // export history of actions in a file
      //   import: true, // import history of actions from a file
      //   jump: true, // jump back and forth (time travelling)
      //   skip: true, // skip (cancel) actions
      //   reorder: true, // drag and drop actions in the history list 
      //   dispatch: true, // dispatch custom actions or action creators
      //   test: true // generate tests for the selected actions
      // },
      serialize: {
        replacer: (key, value) => {
          switch (true) {
            // case is(Wallet.Wallet, value):
            //   return { data: Wallet.toJS(value), __serializedType__: 'Wallet' }
            // case is(Address.Address, value):
            //   return { data: Address.toJS(value), __serializedType__: 'Address' }
            // case is(HDWallet.HDWallet, value):
            //   return { data: HDWallet.toJS(value), __serializedType__: 'HDWallet' }
            // case is(HDAccount.HDAccount, value):
            //   return { data: HDAccount.toJS(value), __serializedType__: 'HDAccount' }
            case is(Wrapper.Wrapper, value):
              return { data: Wrapper.toJS(value), __serializedType__: 'Wrapper' }
            default:
              return value
          }
        },
        reviver: function (key, value) {
          if (typeof value === 'object' && value !== null && '__serializedType__' in value) {
            var data = value.data
            switch (value.__serializedType__) {
              case 'Wrapper': return Wrapper.fromJS(data)
              // case 'Wallet': return Wallet.fromJS(data)
              // case 'Address': return Address.fromJS(data)
              // case 'HDWallet': return HDWallet.fromJS(data)
              // case 'HDAccount': return HDAccount.fromJS(data)
              default: return data
            }
          }
          return value
        }
      }
    }
  ) : compose
  const walletPath = settings.WALLET_IMMUTABLE_PATH

  const store = createStore(
    connectRouter(history)(rootReducer),
    composeEnhancers(
      persistState('session'),
      applyMiddleware(
        routerMiddleware(history),
        autoDisconnectionMiddleware,
        // coreMiddleware.walletSync({isAuthenticated: auth.isAuthenticated, api, walletPath}),
        // coreMiddleware.socket({ socket }),
        sagaMiddleware,
        logger
      )
    )
  )
  sagaMiddleware.run(rootSaga)

  return {
    store,
    history
    // runSaga: sagaMiddleware.run
  }
}

export default configureStore
