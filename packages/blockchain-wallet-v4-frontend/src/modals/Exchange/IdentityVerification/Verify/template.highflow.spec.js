import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import HighFlow from './template.highflow'
import { BackButton } from 'components/IdentityVerification'

const onBack = jest.fn()
const resend = jest.fn()

describe('HighFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const component = shallow(
      <HighFlow mobile={'1234567890'} onBack={onBack} resend={resend} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should trigger onBack on back button click', () => {
    const component = shallow(
      <HighFlow mobile={'1234567890'} onBack={onBack} resend={resend} />
    )
    component
      .find('FooterShadowWrapper')
      .dive()
      .find(BackButton)
      .simulate('click')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('should trigger resend on resend link click', () => {
    const component = shallow(
      <HighFlow mobile={'1234567890'} onBack={onBack} resend={resend} />
    )
    component
      .find('FooterShadowWrapper')
      .dive()
      .find('Link')
      .simulate('click')
    expect(resend).toHaveBeenCalledTimes(1)
  })
})
