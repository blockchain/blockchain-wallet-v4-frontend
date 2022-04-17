import React from 'react'
import { shallow } from 'enzyme'

import { SeparatedList } from './SeparatedList'

describe('<SeparatedList />', () => {
  it('Should not render any separator when there is a single child', () => {
    const wrapper = shallow(
      <SeparatedList separator={<div data-testid='separator' />}>
        <span>Item 1</span>
      </SeparatedList>
    )

    expect(wrapper.contains('Item 1')).toBe(true)
    expect(wrapper.find({ 'data-testid': 'separator' })).toHaveLength(0)
  })

  it('Should render all 3 children and only 2 separators', () => {
    const wrapper = shallow(
      <SeparatedList separator={<div data-testid='separator' />}>
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
      </SeparatedList>
    )

    expect(wrapper.contains('Item 1')).toBe(true)
    expect(wrapper.contains('Item 2')).toBe(true)
    expect(wrapper.contains('Item 3')).toBe(true)
    expect(wrapper.find({ 'data-testid': 'separator' })).toHaveLength(2)
  })
})
