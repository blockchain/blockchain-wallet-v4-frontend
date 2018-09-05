import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MenuTop } from './index'

jest.mock('blockchain-info-components', () => ({ Images: '', TextGroup: '' }))

describe('MenuTop Component', () => {
  it('should render with correct links and without error', () => {
    const comp = shallow(<MenuTop />)
    const tabMenu = comp.getElement().props.children[0]
    expect(tabMenu.props.children[0].props.to).toEqual('/exchange')
    expect(tabMenu.props.children[1].props.to).toEqual('/exchange/history')
  })

  it('matches snapshot', () => {
    const component = shallow(<MenuTop />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
