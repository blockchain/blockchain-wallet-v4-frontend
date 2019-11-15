import { shallow } from 'enzyme'
import React from 'react'
import TemplateLoading from './template.loading'
import toJson from 'enzyme-to-json'
jest.mock('blockchain-info-components', () => ({ Image: 'image' }))

describe('PriceChart template loading', () => {
  it('renders correctly', () => {
    const component = shallow(<TemplateLoading />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
