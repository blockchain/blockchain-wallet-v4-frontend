import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MenuTop } from './index'

jest.mock('blockchain-info-components', () => ({
  Images: '',
  TextGroup: '',
  TabMenu: '',
  TabMenuItem: ''
}))

describe('MenuTop Component', () => {
  it('should render with correct links and without error', () => {
    const component = shallow(<MenuTop />)
    const LinkContainer = component.find('LinkContainer')
    expect(LinkContainer.at(0).prop('to')).toBe('/swap')
    expect(LinkContainer.at(1).prop('to')).toBe('/swap/history')
  })

  it('matches snapshot', () => {
    const component = shallow(<MenuTop />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
