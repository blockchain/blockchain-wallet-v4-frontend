import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import TemplateError from './template.error'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('CoinTicker template error', () => {
  it('renders correctly', () => {
    const baseProps = { children: 'Error message' }
    const component = shallow(<TemplateError {...baseProps} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
