import { shallow } from 'enzyme'
import Footer from './index'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('components/DropdownLanguage', () => ({ DropdownLanguage: '' }))
jest.mock('blockchain-info-components', () => ({}))

describe('Public Footer Component', () => {
  it('should match snapshot', () => {
    const component = shallow(<Footer />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
