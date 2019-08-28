import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import WhatsNewIcon from './template'

jest.mock('blockchain-info-components', () => ({
  Link: 'link',
  Icon: 'icon',
  Text: 'text',
  TooltipHost: 'tooltiphost'
}))

describe('WhatsNewIcon', () => {
  it('renders correctly', () => {
    const component = shallow(<WhatsNewIcon numOfNewAnnouncements={0} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
