import React from 'react'
import { forEachObjIndexed } from 'ramda'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Remote } from 'blockchain-wallet-v4'
import { RatesBox } from './RatesBox'

const props = {
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  currency: '$'
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
