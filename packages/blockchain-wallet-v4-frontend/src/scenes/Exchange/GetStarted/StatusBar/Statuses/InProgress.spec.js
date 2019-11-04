import { InProgress } from './InProgress'
import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

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
