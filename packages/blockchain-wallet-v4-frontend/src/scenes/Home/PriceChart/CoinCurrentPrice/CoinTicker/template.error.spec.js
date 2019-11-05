import { shallow } from 'enzyme'
import React from 'react'
import TemplateError from './template.error'
import toJson from 'enzyme-to-json'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('CoinTicker template error', () => {
  it('renders correctly', () => {
    const baseProps = { children: 'Error message' }
    const component = shallow(<TemplateError {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
