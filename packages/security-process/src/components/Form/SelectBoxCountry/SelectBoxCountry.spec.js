import { filter } from 'ramda'
import React from 'react'
import { shallow } from 'enzyme'
import SelectBoxCountry, {
  countries,
  whiteBlackListsConflictMessage
} from './index.js'

jest.mock('blockchain-info-components', () => ({ SelectInput: 'select-input' }))

describe('SelectBoxCountry', () => {
  it('should return all countries by default', () => {
    const wrapper = shallow(<SelectBoxCountry />)
    expect(wrapper.prop('elements')[0].items).toBe(countries)
  })

  it('should throw if both whitelist and blacklist are specified', () => {
    expect(() =>
      shallow(<SelectBoxCountry whiteList={['']} blackList={['']} />)
    ).toThrowError(whiteBlackListsConflictMessage)
  })

  it('should use white list', () => {
    const wrapper = shallow(<SelectBoxCountry whiteList={['GB', 'AE']} />)
    expect(wrapper.prop('elements')[0].items).toEqual([
      { text: 'United Arab Emirates', value: 'AE' },
      { text: 'United Kingdom', value: 'GB' }
    ])
  })

  it('should use black list', () => {
    const wrapper = shallow(<SelectBoxCountry blackList={['GB', 'AE']} />)
    expect(wrapper.prop('elements')[0].items).toEqual(
      filter(({ value }) => value !== 'GB' && value !== 'AE', countries)
    )
  })
})
