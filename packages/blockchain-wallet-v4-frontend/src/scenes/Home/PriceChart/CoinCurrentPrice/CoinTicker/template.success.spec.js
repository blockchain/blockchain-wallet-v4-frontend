import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import TemplateSuccess from './template.loading'
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
