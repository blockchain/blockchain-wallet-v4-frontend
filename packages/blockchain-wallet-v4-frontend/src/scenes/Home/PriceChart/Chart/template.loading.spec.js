import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import TemplateLoading from './template.loading'
jest.mock('blockchain-info-components', () => ({ Image: 'image' }))

describe('CoinTicker template loading', () => {
  it('renders correctly', () => {
    const component = shallow(<TemplateLoading />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
