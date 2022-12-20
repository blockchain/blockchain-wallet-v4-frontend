import React from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { ThemeProvider } from 'styled-components'

import { Palette } from 'blockchain-info-components'
import { Analytics } from 'data/analytics/types'

import ErrorBoundary from './index'

const setup = (children: React.ReactNode) => {
  const store = configureStore()({
    auth: {}
  })

  render(
    <BrowserRouter>
      <IntlProvider locale='en' messages={{}}>
        <ThemeProvider theme={Palette('default')}>
          <Provider store={store}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Provider>
        </ThemeProvider>
      </IntlProvider>
    </BrowserRouter>
  )

  return {
    store
  }
}

describe('ErrorBoundary', () => {
  describe('when children did not throw error', () => {
    const ComponentWithoutError = () => {
      return null
    }

    it('should not dispatch any actions', () => {
      const { store } = setup(<ComponentWithoutError />)

      expect(store.getActions()).toEqual([])
    })
  })

  describe('when children throw error', () => {
    const ComponentWithError = () => {
      throw new Error('Some client error')
    }

    it('should dispatch event tracking with correct payload', () => {
      const { store } = setup(<ComponentWithError />)

      expect(store.getActions()).toEqual([
        {
          payload: {
            key: Analytics.CLIENT_ERROR,
            properties: {
              error: 'FATAL_ERROR',
              source: 'CLIENT',
              title: 'Some client error'
            }
          },
          type: 'trackEvent'
        }
      ])
    })
  })

  it.todo('other test cases')
})
