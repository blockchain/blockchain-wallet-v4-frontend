import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ModalBody from './ModalBody'

describe('ModalBody component', () => {
  it('default renders correctly', () => {
    const component = shallow(<ModalBody loading />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
