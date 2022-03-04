import React from 'react'
import { mount } from 'enzyme'

import { Tab, Tabs } from '..'

describe('Tabs', () => {
  it('Should show all the children tabs', () => {
    const wrapper = mount(
      <Tabs>
        <Tab>Live</Tab>
        <Tab>1d</Tab>
        <Tab>1w</Tab>
      </Tabs>
    )

    expect(wrapper.text()).toContain('Live')
    expect(wrapper.text()).toContain('1d')
    expect(wrapper.text()).toContain('1w')
  })
})
