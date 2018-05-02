import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import WhatsNewContainer from './index'
jest.mock('./template', () => 'template')

describe('WhatsNewContainer', () => {
  it('renders correctly', () => {
    const component = shallow(<WhatsNewContainer />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
