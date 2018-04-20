import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { dissoc } from 'ramda'
import { testPropTypes } from 'utils/tests'
import TemplateSuccess from './template.success'
jest.mock('blockchain-info-components', () => ({ Link: 'link' }))

describe('CoinTicker template success', () => {
  const props = { coin: '10', fiat: '100', handleClick: jest.fn(), selected: false }

  it('renders correctly', () => {
    const component = shallow(<TemplateSuccess {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop coin', () => {
    const testValues = [
      ['10'],
      [0, undefined, null, {}]
    ]
    testPropTypes(TemplateSuccess, 'coin', testValues, dissoc('coin', props))
  })

  it('should accept a mandatory string for prop fiat', () => {
    const testValues = [
      ['100'],
      [0, undefined, null, {}]
    ]
    testPropTypes(TemplateSuccess, 'fiat', testValues, dissoc('fiat', props))
  })

  it('should accept a mandatory function for prop handleClick', () => {
    const testValues = [
      [jest.fn()],
      [0, undefined, null, {}]
    ]
    testPropTypes(TemplateSuccess, 'handleClick', testValues, dissoc('handleClick', props))
  })

  it('should accept a bool for prop selected', () => {
    const testValues = [
      [true, false],
      [100]
    ]
    testPropTypes(TemplateSuccess, 'selected', testValues, dissoc('selected', props))
  })
})
