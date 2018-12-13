import React from 'react'
import { forEachObjIndexed } from 'ramda'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Remote } from 'blockchain-wallet-v4'
import { ComplementaryAmount } from './ComplementaryAmount'

const props = {
  isFiat: false,
  complementarySymbol: 'BTC'
}

const STUB_AMOUNT = 100

const amountValues = {
  notAsked: Remote.NotAsked,
  loading: Remote.Loading,
  success: Remote.Success(STUB_AMOUNT),
  failure: Remote.Failure({})
}

describe('Exchange RatesBox', () => {
  forEachObjIndexed(
    (complementaryAmount, complementaryAmountIndex) =>
      it(`should render correct rates for sourceToTargetRate ${complementaryAmountIndex}`, () => {
        const component = shallow(
          <ComplementaryAmount
            {...props}
            complementaryAmount={complementaryAmount}
          />
        )
        const tree = toJson(component)
        expect(tree).toMatchSnapshot()
      }),
    amountValues
  )

  it('should render fiat value correctly', () => {
    const component = mount(
      <ComplementaryAmount
        complementarySymbol='$'
        isFiat
        complementaryAmount={Remote.of(STUB_AMOUNT)}
      />
    )
    expect(component.find('StringDisplayContainer').text()).toBe('$100.00')
  })

  it('should render crypto value correctly', () => {
    const component = mount(
      <ComplementaryAmount
        complementarySymbol='BTC'
        isFiat={false}
        complementaryAmount={Remote.of(STUB_AMOUNT)}
      />
    )
    expect(component.find('StringDisplayContainer').text()).toBe('100.00 BTC')
  })
})
