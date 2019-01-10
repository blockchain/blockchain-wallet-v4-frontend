import React from 'react'
import { shallow } from 'enzyme'

import { MinMaxButtons, MinMaxButton, MinMaxValue } from './MinMaxButtons'

const useMin = jest.fn()
const useMax = jest.fn()

const actions = { useMin, useMax }
const props = {
  actions,
  minIsFiat: true,
  minSymbol: '$',
  minAmount: '1',
  maxIsFiat: false,
  maxSymbol: 'BTC',
  maxAmount: '0.12345678'
}
const EXPECTED_VALUES = {
  MIN: `${props.minSymbol}${props.minAmount}.00`,
  MAX: `${props.maxAmount} ${props.maxSymbol}`
}

describe('Exchange MinMaxButtons', () => {
  it('should have disabled buttons without values when disabled is true', () => {
    const wrapper = shallow(<MinMaxButtons disabled actions={actions} />)
    const minButton = wrapper.find(MinMaxButton).at(0)
    const maxButton = wrapper.find(MinMaxButton).at(1)
    const minValue = wrapper.find(MinMaxValue).at(0)
    const maxValue = wrapper.find(MinMaxValue).at(1)
    expect(minButton.prop('disabled')).toBe(true)
    expect(maxButton.prop('disabled')).toBe(true)
    expect(minValue.children().length).toBe(0)
    expect(maxValue.children().length).toBe(0)
  })

  it('should show values when enabled', () => {
    const wrapper = shallow(<MinMaxButtons {...props} />)
    const minButton = wrapper.find(MinMaxButton).at(0)
    const maxButton = wrapper.find(MinMaxButton).at(1)
    const minValue = wrapper.find(MinMaxValue).at(0)
    const maxValue = wrapper.find(MinMaxValue).at(1)
    expect(minButton.prop('disabled')).toBeFalsy()
    expect(maxButton.prop('disabled')).toBeFalsy()
    expect(minValue.childAt(0).text()).toBe(EXPECTED_VALUES.MIN)
    expect(maxValue.childAt(0).text()).toBe(EXPECTED_VALUES.MAX)
  })

  it('should respond to clicks when enabled', () => {
    const wrapper = shallow(<MinMaxButtons {...props} />)
    const minButton = wrapper.find(MinMaxButton).at(0)
    const maxButton = wrapper.find(MinMaxButton).at(1)
    minButton.simulate('click')
    expect(actions.useMin).toHaveBeenCalledTimes(1)
    maxButton.simulate('click')
    expect(actions.useMax).toHaveBeenCalledTimes(1)
  })
})
