import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import TemplateSuccess from './template.success'
jest.mock('blockchain-info-components', () => ({
  Image: 'image',
  Color: () => 'color'
}))

describe('CoinTicker template Success', () => {
  it('renders correctly', () => {
    const component = shallow(<TemplateSuccess coin='BTC' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
