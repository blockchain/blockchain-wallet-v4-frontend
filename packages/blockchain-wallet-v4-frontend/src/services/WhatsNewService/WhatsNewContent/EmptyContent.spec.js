import { shallow } from 'enzyme'
import EmptyContent from './EmptyContent'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  Text: 'text'
}))

describe('EmptyContent', () => {
  it('renders correctly', () => {
    const component = shallow(<EmptyContent />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
