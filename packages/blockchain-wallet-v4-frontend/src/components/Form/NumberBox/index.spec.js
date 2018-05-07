import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import NumberBox from './index.js'
jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('NumberBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(<NumberBox {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
