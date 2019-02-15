import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Menu } from './index'

jest.mock('blockchain-info-components', () => ({
  Button: '',
  TextGroup: '',
  TabMenu: '',
  TabMenuItem: ''
}))

describe('Menu Component', () => {
  it('should render with correct links and without error', () => {
    const component = shallow(<Menu />)
    const LinkContainer = component.find('LinkContainer')
    expect(LinkContainer.at(0).prop('to')).toBe('/swap')
    expect(LinkContainer.at(1).prop('to')).toBe('/swap/history')
  })

  it('matches snapshot', () => {
    const component = shallow(<Menu />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should trigger showHelpModal on button click', () => {
    const showHelpModal = jest.fn()
    const component = shallow(<Menu showHelpModal={showHelpModal} />)
    component.find('Menu__SupportButton').simulate('click')
    expect(showHelpModal).toHaveBeenCalledTimes(1)
  })
})
