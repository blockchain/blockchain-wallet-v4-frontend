import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Template from './template'

describe('Banner component', () => {
  it('type standard renders correctly', () => {
    const component = shallow(<Template>STANDARD</Template>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type alert renders correctly', () => {
    const component = shallow(<Template type='alert'>ALERT</Template>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type success renders correctly', () => {
    const component = shallow(<Template type='success'>SUCCESS</Template>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type warning renders correctly', () => {
    const component = shallow(<Template type='warning'>WARNING</Template>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type caution renders correctly', () => {
    const component = shallow(<Template type='caution' size='12px' weight={200} width='130%'>ALERT</Template>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
