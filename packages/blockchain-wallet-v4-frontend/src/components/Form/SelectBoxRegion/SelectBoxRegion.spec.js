import { find, map, pipe, prop, propEq } from 'ramda'
import { shallow } from 'enzyme'
import countryRegionData from 'country-region-data'
import React from 'react'
import SelectBoxRegion from './index.js'

jest.mock('blockchain-info-components', () => ({ SelectInput: 'select-input' }))

describe('SelectBoxRegion', () => {
  it('should render no select options if country is not supplied', () => {
    const wrapper = shallow(<SelectBoxRegion />)
    expect(wrapper.prop('elements')[0].items).toEqual([])
  })

  it('should render no select options if country is not in the list', () => {
    const wrapper = shallow(<SelectBoxRegion countryCode={'XX'} />)
    expect(wrapper.prop('elements')[0].items).toEqual([])
  })

  it("should render country's regions", () => {
    const country = 'GB'
    const wrapper = shallow(<SelectBoxRegion countryCode={country} />)
    expect(wrapper.prop('elements')[0].items).toEqual(
      pipe(
        find(propEq('countryShortCode', 'GB')),
        prop('regions'),
        map(({ name, shortCode }) => ({ text: name, value: shortCode }))
      )(countryRegionData)
    )
  })
})
