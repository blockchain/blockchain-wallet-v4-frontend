import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Icon } from '../Icons'
import Banner, { BannerType } from './Banner'

describe('Banner component', () => {
  it('type standard renders correctly', () => {
    const component = shallow(<Banner>STANDARD</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type alert renders correctly', () => {
    const component = shallow(<Banner type={BannerType.ALERT}>ALERT</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type success renders correctly', () => {
    const component = shallow(<Banner type={BannerType.SUCCESS}>SUCCESS</Banner>)

    expect(component.find(Icon)).toHaveLength(1)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type warning renders correctly', () => {
    const component = shallow(<Banner type={BannerType.WARNING}>WARNING</Banner>)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type caution renders correctly', () => {
    const component = shallow(
      <Banner type={BannerType.CAUTION} size='12px' weight={400} width='130%'>
        ALERT
      </Banner>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('type success without icon renders correctly', () => {
    const component = shallow(
      <Banner type={BannerType.SUCCESS} icon={null}>
        SUCCESS
      </Banner>
    )

    expect(component.find(Icon)).toHaveLength(0)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
