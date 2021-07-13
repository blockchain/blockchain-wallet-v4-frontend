import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ModalHeader from './ModalHeader'

describe('ModalHeader component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <ModalHeader closeButton onClose={() => {}} icon='x' />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
