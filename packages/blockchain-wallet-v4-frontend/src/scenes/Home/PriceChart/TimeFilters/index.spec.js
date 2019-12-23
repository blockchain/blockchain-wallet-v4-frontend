import { shallow } from 'enzyme'
import { testPropTypes } from 'utils/test.utils'
import { TimeFiltersContainer } from './index'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('./template', () => 'template.na.js')
jest.mock('data', () => ({
  selectors: {
    modules: {
      profile: {
        isSilverOrAbove: jest.fn()
      }
    },
    components: {
      priceChart: {
        getTime: jest.fn()
      }
    }
  }
}))

describe('TimeFilters container', () => {
  it('renders correctly', () => {
    const baseProps = { time: '1month', isSilverOrAbove: false }
    const component = shallow(<TimeFiltersContainer {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop time', () => {
    expect(
      testPropTypes(
        TimeFiltersContainer,
        'time',
        ['all', '1day', '1week', '1month', '1year'],
        false
      )
    ).toBeTruthy()
    expect(
      testPropTypes(
        TimeFiltersContainer,
        'time',
        [0, undefined, null, {}],
        true
      )
    ).toBeTruthy()
  })
})
