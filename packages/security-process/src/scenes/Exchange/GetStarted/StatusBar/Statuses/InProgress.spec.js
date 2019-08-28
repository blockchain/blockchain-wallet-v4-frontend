import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { InProgress } from './InProgress'

jest.mock('blockchain-info-components', () => ({
  Button: 'button'
}))

describe('InProgress', () => {
  it('renders correctly', () => {
    const component = shallow(<InProgress />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
