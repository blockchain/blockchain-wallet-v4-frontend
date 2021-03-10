import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Banner from './Banner'

describe('Banner component', () => {
  it('type standard renders correctly', () => {
    const component = shallow(<Banner>STANDARD</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type alert renders correctly', () => {
    const component = shallow(<Banner type='alert'>ALERT</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type success renders correctly', () => {
    const component = shallow(<Banner type='success'>SUCCESS</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type warning renders correctly', () => {
    const component = shallow(<Banner type='warning'>WARNING</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type caution renders correctly', () => {
    const component = shallow(
      <Banner type='caution' size='12px' weight={400} width='130%'>
        ALERT
      </Banner>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
