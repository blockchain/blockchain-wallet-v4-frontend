import { shallow } from 'enzyme'
import React from 'react'
import TemplateSuccess from './template.success'
import toJson from 'enzyme-to-json'
jest.mock('blockchain-info-components', () => ({
  Image: 'image',
  Color: () => 'color'
}))

describe('PriceChart template Success', () => {
  it('renders correctly', () => {
    const component = shallow(<TemplateSuccess coin='BTC' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
