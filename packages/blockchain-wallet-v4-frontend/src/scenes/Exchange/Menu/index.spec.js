import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MenuTop } from './index'

jest.mock('blockchain-info-components', () => ({ Images: '', TextGroup: '' }))

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

  it('should have correct item selected', () => {
    const component = shallow(<MenuTop historySelected={false} />)
    const exchangeItem = component
      .find('LinkContainer')
      .at(0)
      .children()
      .first()
    expect(exchangeItem.prop('selected')).toBe(true)

    component.setProps({ historySelected: true })
    const historyItem = component
      .find('LinkContainer')
      .at(1)
      .children()
      .first()
    expect(historyItem.prop('selected')).toBe(true)
  })
})
