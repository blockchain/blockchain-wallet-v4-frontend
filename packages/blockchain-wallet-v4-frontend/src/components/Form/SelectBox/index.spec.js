import { mount, shallow } from 'enzyme'
import React from 'react'
import SelectBox from './index.js'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({
  SelectInput: ({ getRef, ...props }) => <input {...props} ref={getRef} />
}))

const fakeInput = {
  onBlur: jest.fn(),
  onChange: jest.fn(),
  onFocus: jest.fn(),
  value: ''
}

const fakeElements = [
  {
    group: 'fakeG',
    items: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 }
    ]
  }
]

describe('SelectBox', () => {
  it('renders correctly', () => {
    const props = { meta: {} }
    const component = shallow(
      <SelectBox {...props} input={fakeInput} elements={fakeElements} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should focus inner ref on active props change', () => {
    const props = { meta: { active: false } }
    const wrapper = mount(
      <SelectBox {...props} input={fakeInput} elements={fakeElements} />
    )
    const focusSpy = jest.fn()
    wrapper.find('input').instance().focus = focusSpy

    wrapper.setProps({
      meta: { active: true }
    })
    expect(focusSpy).toHaveBeenCalledTimes(1)

    wrapper.setProps({
      meta: { active: false }
    })
    expect(focusSpy).toHaveBeenCalledTimes(1)

    wrapper.setProps({
      meta: { active: true }
    })
    expect(focusSpy).toHaveBeenCalledTimes(2)
  })
})
