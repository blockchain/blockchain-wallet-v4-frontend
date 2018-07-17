import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Footer from './index'

jest.mock('components/DropdownLanguage', () => ({ DropdownLanguage: '' }))
jest.mock('blockchain-info-components', () => ({}))

describe('Public Footer Component', () => {
  window.APP_VERSION = 'v4.2.0'
  it('should match snapshot', () => {
    const component = shallow(<Footer />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
