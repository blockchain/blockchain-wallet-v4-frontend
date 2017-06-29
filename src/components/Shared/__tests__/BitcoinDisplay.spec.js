import React from 'react'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'

import BitcoinDisplay from '../BitcoinDisplay'

describe('BitcoinDisplay', () => {
  const mockStore = configureStore()

  test('Displays 100000000 satoshis as bitcoin (BTC)', () => {
    let initialState = { settings: { unit: 'BTC' } }
    let store = mockStore(initialState)
    let component = renderer.create(
      <BitcoinDisplay store={store} amount={100000000} />
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
