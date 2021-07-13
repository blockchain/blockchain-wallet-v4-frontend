import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'

import formReducer from 'data/form/reducers'
import { preferencesReducer } from 'data/preferences/reducers'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'

export const createTestStore = (
  reducers = {},
  sagas = [],
  middlewares = []
) => {
  const sagaMiddleware = createSagaMiddleware()
  const combinedReducers = combineReducers({
    form: formReducer,
    preferences: preferencesReducer,
    ...reducers
  })
  const createTestStore = applyMiddleware(
    sagaMiddleware,
    ...middlewares
  )(createStore)
  const testStore = createTestStore(combinedReducers)
  sagaMiddleware.run(function * () {
    yield all(map(fork, sagas))
  })

  return testStore
}

export const TestBed = ({ children, initialRoutes, store, withRouter }) => (
  <Provider store={store}>
    <IntlProvider locale='en' messages={{}}>
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
    </IntlProvider>
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
