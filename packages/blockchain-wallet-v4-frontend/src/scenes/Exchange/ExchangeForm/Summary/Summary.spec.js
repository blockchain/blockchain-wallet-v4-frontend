import React from 'react'
import { forEachObjIndexed } from 'ramda'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Remote } from 'blockchain-wallet-v4'
import { Summary } from './Summary'

const props = {
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  currency: '$',
  sourceFee: {
    source: 1
  }
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
    (sourceAmount, sourceAmountIndex) =>
      forEachObjIndexed(
        (targetAmount, targetAmountIndex) =>
          forEachObjIndexed(
            (targetFiat, targetFiatIndex) =>
              it(`should render correct rates for sourceToTargetRate ${sourceAmountIndex}, sourceToFiatRate ${targetAmountIndex}, targetToFiatRate ${targetFiatIndex}`, () => {
                const component = shallow(
                  <Summary
                    {...props}
                    sourceAmount={sourceAmount}
                    targetAmount={targetAmount}
                    targetFiat={targetFiat}
                  />
                )

                const tree = toJson(component)
                expect(tree).toMatchSnapshot()
              }),
            amountValues
          ),
        amountValues
      ),
    amountValues
  )
})
