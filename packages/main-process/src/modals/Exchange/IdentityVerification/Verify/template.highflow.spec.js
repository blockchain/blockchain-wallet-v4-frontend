import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import HighFlow from './template.highflow'
import { BackButton } from 'components/IdentityVerification'
import { Button } from 'blockchain-info-components'

const onBack = jest.fn()
const send = jest.fn()
const done = jest.fn()

const EMAIL = 'f@ke.mail'
const DEEP_LINK = 'https://blockchainwallet.page.link/dashboard'

const props = {
  email: EMAIL,
  deeplink: DEEP_LINK,
  onBack,
  send,
  done
}

describe('HighFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    const component = shallow(<HighFlow {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should trigger email send on mount', () => {
    shallow(<HighFlow {...props} />)
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('should trigger onBack on back button click', () => {
    const component = shallow(<HighFlow {...props} />)
    component
      .find('FooterShadowWrapper')
      .dive()
      .find(BackButton)
      .simulate('click')
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('should trigger done on done button click', () => {
    const component = shallow(<HighFlow {...props} />)
    component
      .find('FooterShadowWrapper')
      .dive()
      .find(Button)
      .simulate('click')
    expect(done).toHaveBeenCalledTimes(1)
  })
})
