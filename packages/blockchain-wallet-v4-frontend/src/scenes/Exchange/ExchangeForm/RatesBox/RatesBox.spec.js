import { forEachObjIndexed } from 'ramda'
import { RatesBox } from './RatesBox'
import { Remote } from 'blockchain-wallet-v4/src'
import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

const props = {
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  currency: '$',
  balance: Remote.of({ balanceMax: {}, balanceMaxFiat: '$1000.00' })
}

const STUB_RATE = 100

const rateValues = {
  notAsked: Remote.NotAsked,
  loading: Remote.Loading,
  success: Remote.Success(STUB_RATE),
  failure: Remote.Failure({})
}

describe('Exchange RatesBox', () => {
  forEachObjIndexed(
    sourceToTargetRate =>
      it('should render correct rates for sourceToTarget', () => {
        const component = shallow(
          <RatesBox {...props} sourceToTargetRate={sourceToTargetRate} />
        )

        const tree = toJson(component)
        expect(tree).toMatchSnapshot()
      }),
    rateValues
  )
})
