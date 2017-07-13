import React from 'react'
import renderer from 'react-test-renderer'
import configureStore from 'redux-mock-store'

import CoinDisplay from './index.js'

describe('CoinDisplay', () => {
  const mockStore = configureStore()

  test('Displays 100000000 satoshis as bitcoin (BTC)', () => {
    let initialState = { settings: { unit: 'BTC' } }
    let store = mockStore(initialState)
    let component = renderer.create(
      <CoinDisplay store={store}>{100000000}</CoinDisplay>
    )

    expect(component.toJSON()).toMatchSnapshot()
  })
})
