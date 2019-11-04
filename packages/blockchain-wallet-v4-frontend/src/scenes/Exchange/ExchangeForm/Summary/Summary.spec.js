import { forEachObjIndexed } from 'ramda'
import { Remote } from 'blockchain-wallet-v4'
import { shallow } from 'enzyme'
import { Summary } from './Summary'
import React from 'react'
import toJson from 'enzyme-to-json'

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

describe('Exchange Summary', () => {
  forEachObjIndexed(
    sourceFiat =>
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
                        sourceFiat={sourceFiat}
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
      ),
    amountValues
  )
})
