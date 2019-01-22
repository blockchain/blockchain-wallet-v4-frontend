import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { SwapReceiveSwitch } from './SwapReceiveSwitch'

const swapFix = jest.fn()

describe('SwapReceiveSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should render correctly', () => {
    const component = shallow(
      <SwapReceiveSwitch
        sourceCoin='BTC'
        targetCoin='XLM'
        sourceActive={true}
        targetActive={false}
        swapFix={swapFix}
      />
    )

    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should call swap fix upon swap button or text if source is not active', () => {
    const component = shallow(
      <SwapReceiveSwitch
        sourceCoin='BTC'
        targetCoin='XLM'
        sourceActive={false}
        targetActive={true}
        swapFix={swapFix}
      />
    )

    const button = component.find('[data-e2e="exchangeExchangeRadioButton"]')
    const text = component.find('[data-e2e="exchangeExchangeRadioText"]')

    button.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(1)

    text.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(2)
  })

  it('should not call swap fix upon swap button or text if source is active', () => {
    const component = shallow(
      <SwapReceiveSwitch
        sourceCoin='BTC'
        targetCoin='XLM'
        sourceActive={true}
        targetActive={false}
        swapFix={swapFix}
      />
    )

    const button = component.find('[data-e2e="exchangeExchangeRadioButton"]')
    const text = component.find('[data-e2e="exchangeExchangeRadioText"]')

    button.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(0)

    text.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(0)
  })

  it('should call swap fix upon receive button or text if target is not active', () => {
    const component = shallow(
      <SwapReceiveSwitch
        sourceCoin='BTC'
        targetCoin='XLM'
        sourceActive={true}
        targetActive={false}
        swapFix={swapFix}
      />
    )

    const button = component.find('[data-e2e="exchangeReceiveRadioButton"]')
    const text = component.find('[data-e2e="exchangeReceiveRadioText"]')

    button.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(1)

    text.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(2)
  })

  it('should not call swap fix upon receive button or text if target is active', () => {
    const component = shallow(
      <SwapReceiveSwitch
        sourceCoin='BTC'
        targetCoin='XLM'
        sourceActive={false}
        targetActive={true}
        swapFix={swapFix}
      />
    )

    const button = component.find('[data-e2e="exchangeReceiveRadioButton"]')
    const text = component.find('[data-e2e="exchangeReceiveRadioText"]')

    button.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(0)

    text.simulate('click')
    expect(swapFix).toHaveBeenCalledTimes(0)
  })
})
