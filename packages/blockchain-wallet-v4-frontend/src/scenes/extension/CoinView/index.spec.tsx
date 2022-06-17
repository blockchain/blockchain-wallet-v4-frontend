import React from 'react'
import { Provider } from 'react-redux'
import { CoinView } from 'blockchain-wallet-v4-frontend/src/scenes/extension/CoinView'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()
const store = mockStore({})

describe('CoinView extension tab', (): void => {
  const container = shallow(
    <Provider store={store}>
      <CoinView />
    </Provider>
  )
  it('CoinView tab renders correctly', (): void => {
    const tree = toJson(container)
    expect(tree).toMatchSnapshot()
  })
})
