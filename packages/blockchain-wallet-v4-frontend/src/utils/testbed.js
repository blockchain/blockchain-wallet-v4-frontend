import { all, fork } from 'redux-saga/effects'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { IntlProvider } from 'react-intl'
import { map } from 'ramda'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import formReducer from 'data/form/reducers'
import preferencesReducer from 'data/preferences/reducers'
import PropTypes from 'prop-types'
import React from 'react'
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
  const createTestStore = applyMiddleware(sagaMiddleware, ...middlewares)(
    createStore
  )
  const testStore = createTestStore(combinedReducers)
  sagaMiddleware.run(function * () {
    yield all(map(fork, sagas))
  })

  return testStore
}

export const TestBed = ({ store, withRouter, initialRoutes, children }) => (
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
