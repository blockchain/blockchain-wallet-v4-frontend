import React from 'react'
import PropTypes from 'prop-types'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import { MemoryRouter } from 'react-router'
import { map } from 'ramda'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ConnectedIntlProvider from 'providers/ConnectedIntlProvider'
import ThemeProvider from 'providers/ThemeProvider'
import configureLocales from 'services/LocalesService'
import preferencesReducer from 'data/preferences/reducers'
import formReducer from 'data/form/reducers'

export const createTestStore = (
  reducers = {},
  sagas = [],
  middlewares = []
) => {
  const sagaMiddleware = createSagaMiddleware()
  const combinedReducers = combineReducers({
    form: formReducer,
    prferences: preferencesReducer,
    ...reducers
  })
  const createTestStore = applyMiddleware(sagaMiddleware, ...middlewares)(
    createStore
  )
  const testStore = createTestStore(combinedReducers)
  sagaMiddleware.run(function*() {
    yield all(map(fork, sagas))
  })

  return testStore
}

const messages = configureLocales()

export const TestBed = ({ store, withRouter, initialRoutes, children }) => (
  <Provider store={store}>
    <ConnectedIntlProvider messages={messages}>
      <ThemeProvider>
        <MediaContextProvider>
          {withRouter ? (
            <MemoryRouter initialEntries={initialRoutes}>
              {children}
            </MemoryRouter>
          ) : (
            children
          )}
        </MediaContextProvider>
      </ThemeProvider>
    </ConnectedIntlProvider>
  </Provider>
)

TestBed.propTypes = {
  store: PropTypes.any.isRequired,
  withRouter: PropTypes.bool,
  initialRoutes: PropTypes.array
}

TestBed.defaultProps = {
  withRouter: false,
  initialRoutes: ['/']
}

export const getDispatchSpyReducer = () => {
  const dispatchSpy = jest.fn(() => ({}))
  const spyReducer = (state, action) => dispatchSpy(action)

  return { dispatchSpy, spyReducer }
}
