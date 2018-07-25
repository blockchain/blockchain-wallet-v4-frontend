import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ModalFooter from './ModalFooter'

describe('ModalFooter component', () => {
  it('default renders correctly', () => {
    const component = shallow(<ModalFooter align='left' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
