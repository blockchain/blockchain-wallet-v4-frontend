import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { CurrencySelect } from './CurrencySelect'

const swapBaseAndCounter = jest.fn()
const changeSource = jest.fn()
const changeTarget = jest.fn()

const actions = { swapBaseAndCounter, changeSource, changeTarget }
const FROM_ITEMS = [
  {
    coin: 'BTC',
    accounts: [
      {
        value: {},
        text: 'My Bitcoin Account'
      }
    ]
  }
]
const TO_ITEMS = [
  {
    coin: 'ETH',
    accounts: [
      {
        value: {},
        text: 'My Ethereum Account'
      }
    ]
  }
]
const props = {
  actions,
  fromElements: [{ group: '', items: FROM_ITEMS }],
  toElements: [{ group: '', items: TO_ITEMS }],
  swapDisabled: false
}

describe('Exchange CurrencySelct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const component = shallow(<CurrencySelect {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should trigger changeSource on source change', () => {
    const component = shallow(<CurrencySelect {...props} />)
    const fromField = component.find('Field[name="source"]')
    fromField.simulate('change')
    expect(changeSource).toHaveBeenCalledTimes(1)
  })

  it('should trigger changeTarget on target change', () => {
    const component = shallow(<CurrencySelect {...props} />)
    const fromField = component.find('Field[name="target"]')
    fromField.simulate('change')
    expect(changeTarget).toHaveBeenCalledTimes(1)
  })

  it('should trigger swapBaseAndCounter on swap click', () => {
    const component = shallow(<CurrencySelect {...props} />)
    const fromField = component.find('[name="arrow-switch"]')
    fromField.simulate('click')
    expect(swapBaseAndCounter).toHaveBeenCalledTimes(1)
  })

  it('should not trigger swapBaseAndCounter on swap click if swapDisabled is true', () => {
    const component = shallow(<CurrencySelect {...props} swapDisabled />)
    const fromField = component.find('[name="arrow-switch"]')
    fromField.simulate('click')
    expect(swapBaseAndCounter).toHaveBeenCalledTimes(0)
  })
})
