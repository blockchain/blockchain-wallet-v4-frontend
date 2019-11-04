import { mount, shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import React from 'react'
import toJson from 'enzyme-to-json'

import {
  getErc20CoinList,
  getOptions,
  getSupportedCoins
} from 'blockchain-wallet-v4/src/redux/walletOptions/selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import ListItemContainer from './index'

jest.mock('blockchain-wallet-v4/src/redux/walletOptions/selectors')
jest.mock('./template', () => () => <div />)
jest.mock('blockchain-info-components', () => ({
  TooltipRebuild: jest.fn()
}))

getOptions.mockImplementation(() => Remote.of({}))
getSupportedCoins.mockImplementation(() => Remote.of({}))
getErc20CoinList.mockImplementation(() => Remote.of({}))

const store = configureStore([])({})
const tx = { hash: '123abc' }

describe('ListItemContainer', () => {
  it('renders correctly', () => {
    const component = mount(<ListItemContainer store={store} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  describe('handleEditDescription()', () => {
    it('handles eth tx notes', () => {
      const component = shallow(
        <ListItemContainer transaction={tx} coin='ETH' store={store} />
      )
      const instance = component.dive().instance()
      const spy = jest.spyOn(instance.props.ethActions, 'setTxNotesEth')
      instance.handleEditDescription()
      expect(spy).toHaveBeenCalled()
    })
    it('handles btc tx notes', () => {
      const component = shallow(
        <ListItemContainer transaction={tx} coin='BTC' store={store} />
      )
      const instance = component.dive().instance()
      const spy = jest.spyOn(instance.props.walletActions, 'setTransactionNote')
      instance.handleEditDescription()
      expect(spy).toHaveBeenCalled()
    })
  })
})
