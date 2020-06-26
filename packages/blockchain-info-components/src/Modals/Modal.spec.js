import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import Modal from './Modal'

describe('Modal component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Modal position={1} total={1} size='large' closeButton />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
