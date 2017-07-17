import React from 'react'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'

import CurrencyDisplay from './index.js'

describe('CurrencyDisplay', () => {
  const mockStore = configureStore()

  test('Displays 100000000 satoshis as local currency', () => {
    let initialState = {
      settings: {
        currency: 'GBP'
      },
      data: {
        rates: { 'GBP': { last: 2000, symbol: '£' } }
      }
    }

    let store = mockStore(initialState)
    let component = renderer.create(
      <CurrencyDisplay store={store} className='button'>{100000000}</CurrencyDisplay>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
