import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import SimpleDropdown from './template'

describe('SimpleDropdown component', () => {
  it('default renders correctly', () => {
    const items = [{ text: 'test', value: 'value' }]
    const component = shallow(
      <SimpleDropdown
        items={items}
        selectedItem={{ text: 'test' }}
        callback={() => {}}
        handleClick={() => {}}
        handleCallback={() => {}}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
