import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import EmailVerification, {
  ChangeButton,
  LoadingButton
} from './EmailVerification'

const STUB_EMAIL = 'f@ke.mail'

const props = {
  className: 'cn',
  input: { value: STUB_EMAIL },
  onVerificationSend: jest.fn(),
  onEdit: jest.fn(),
  onUpdate: jest.fn()
}

describe('EmailVerification component', () => {
  describe('rendering', () => {
    it('should render verified state correctly', () => {
      const component = shallow(
        <EmailVerification verified {...props} />
      ).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render verificationSent state correctly', () => {
      const component = shallow(
        <EmailVerification verificationSent {...props} />
      ).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render verificationSent loading state correctly', () => {
      const component = shallow(
        <EmailVerification verificationSent loading {...props} />
      ).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render edit state correctly', () => {
      const component = shallow(<EmailVerification {...props} />).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render edit loading state correctly', () => {
      const component = shallow(<EmailVerification loading {...props} />).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render edit with label correctly', () => {
      const component = shallow(<EmailVerification label {...props} />).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })

    it('should render edit loading with label correctly', () => {
      const component = shallow(
        <EmailVerification loading label {...props} />
      ).dive()
      const tree = toJson(component)
      expect(tree).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should trigger verification send on send click in verificationSent state', () => {
      const component = shallow(
        <EmailVerification verificationSent {...props} />
      ).dive()
      component.find(LoadingButton).simulate('click')
      expect(props.onVerificationSend).toHaveBeenCalledTimes(1)
      expect(props.onVerificationSend).toHaveBeenCalledWith(STUB_EMAIL)
    })

    it('should trigger edit on change email click in verificationSent state', () => {
      const component = shallow(
        <EmailVerification verificationSent {...props} />
      ).dive()
      component.find(ChangeButton).simulate('click')
      expect(props.onEdit).toHaveBeenCalledTimes(1)
    })

    it('should trigger email update on send click in edit state', () => {
      const component = shallow(<EmailVerification {...props} />).dive()
      component.find(LoadingButton).simulate('click')
      expect(props.onUpdate).toHaveBeenCalledTimes(1)
      expect(props.onUpdate).toHaveBeenCalledWith(STUB_EMAIL)
    })
  })
})
