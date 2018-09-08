import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import ListItemContainer from './index'
import configureStore from 'redux-mock-store'

jest.mock('./template', () => () => {
  return <div />
})

jest.mock('blockchain-info-components', () => ({
  TooltipRebuild: jest.fn()
}))

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
      const spy = jest.spyOn(
        instance.props.ethereumActions,
        'setTxNotesEthereum'
      )
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
