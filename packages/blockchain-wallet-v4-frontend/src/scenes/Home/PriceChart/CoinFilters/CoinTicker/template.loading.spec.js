import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import TemplateLoading from './template.loading'
jest.mock('blockchain-info-components', () => ({ SkeletonRectangle: 'skeleton_rectangle' }))

describe('CoinTicker template loading', () => {
  it('renders correctly', () => {
    const baseProps = { children: 'Error message' }
    const component = shallow(<TemplateLoading {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
