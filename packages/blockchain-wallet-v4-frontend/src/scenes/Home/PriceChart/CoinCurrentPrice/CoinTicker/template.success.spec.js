import { shallow } from 'enzyme'
import React from 'react'
import TemplateSuccess from './template.loading'
import toJson from 'enzyme-to-json'
jest.mock('blockchain-info-components', () => ({
  SkeletonRectangle: 'skeleton_rectangle'
}))

describe('CoinTicker template success', () => {
  it('renders correctly', () => {
    const component = shallow(<TemplateSuccess />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
