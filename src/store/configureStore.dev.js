import { createStore, applyMiddleware, compose } from 'redux'
// import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '../sagas'
import reducers from '../reducers'

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware
        // createLogger()
      )
    )
  )
  sagaMiddleware.run(rootSaga)

  return {
    ...store
  }
}

export default configureStore
