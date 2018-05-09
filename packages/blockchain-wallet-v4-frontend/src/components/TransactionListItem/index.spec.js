import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import ListItemContainer from './index'
import configureStore from 'redux-mock-store'
jest.mock('./template', () => 'template')
const store = configureStore([])({})

const tx = { hash: '123abc' }

describe('ListItemContainer', () => {
  it('renders correctly', () => {
    const component = mount(<ListItemContainer minConfirmations={3} store={store} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  describe('handleCoinToggle()', () => {
    it('calls preferencesActions.toggleCoinDisplayed', () => {
      const component = shallow(<ListItemContainer minConfirmations={3} store={store} />)
      const instance = component.dive().instance()
      const spy = jest.spyOn(instance.props.preferencesActions, 'toggleCoinDisplayed')
      instance.handleCoinToggle()
      expect(spy).toHaveBeenCalled()
    })
  })
  describe('handleEditDescription()', () => {
    it('handles eth tx notes', () => {
      const component = shallow(<ListItemContainer minConfirmations={3} transaction={tx} coin='ETH' store={store} />)
      const instance = component.dive().instance()
      const spy = jest.spyOn(instance.props.ethereumActions, 'setTxNotesEthereum')
      instance.handleEditDescription()
      expect(spy).toHaveBeenCalled()
    })
    it('handles btc tx notes', () => {
      const component = shallow(<ListItemContainer minConfirmations={3} transaction={tx} coin='BTC' store={store} />)
      const instance = component.dive().instance()
      const spy = jest.spyOn(instance.props.walletActions, 'setTransactionNote')
      instance.handleEditDescription()
      expect(spy).toHaveBeenCalled()
    })
  })
})
