import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ComponentDropdown from './template'

describe('ComponentDropdown component', () => {
  it('default renders correctly', () => {
    const components = [{ text: 'test', value: 'value' }]
    const component = shallow(
      <ComponentDropdown
        components={components}
        callback={() => {}}
        handleClick={() => {}}
        handleCallback={() => {}}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
