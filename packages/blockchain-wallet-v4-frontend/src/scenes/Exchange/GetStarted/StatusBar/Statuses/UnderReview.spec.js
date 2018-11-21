import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { UnderReview } from './UnderReview'

jest.mock('@blockchain-com/components', () => ({
  FasExclamationCircle: 'FasExclamationCircle'
}))

jest.mock('blockchain-info-components', () => ({
  Icon: 'icon',
  Text: 'text'
}))

describe('UnderReview', () => {
  it('renders correctly', () => {
    const component = shallow(<UnderReview />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
