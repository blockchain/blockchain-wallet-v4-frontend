import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import Bowser from 'bowser'
import styled from 'styled-components'

import {
  // Banner,
  Button,
  // HeartbeatLoader,
  Icon,
  // Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import {
  // FormError,
  // FormGroup,
  // FormItem,
  FormLabel
  // PasswordBox,
  // TextBox
} from 'components/Form'
import { Wrapper } from 'components/Public'

import { LoginFormType, LoginSteps } from '.'

export const LOGIN_NEW = 'loginNew'

export const removeWhitespace = string => string.replace(/\s/g, ``)
const browser = Bowser.getParser(window.navigator.userAgent)
export const isSupportedBrowser = browser.satisfies({
  chrome: '>45',
  chromium: '>45',
  edge: '>16',
  firefox: '>45',
  opera: '>20',
  safari: '>8',
  vivaldi: '>2'
})

export const ActionButton = styled(Button)`
  margin-top: 15px;
`

export const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`

export const LoginTextGroup = styled(TextGroup)`
  line-height: 1;
  margin: 12px 0;
  text-align: center;
`
export const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`
export const CircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background-color: ${props => props.theme.blue600};
  border-radius: 40px;
  margin-bottom: 8px;
`
export const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`
export const SignUpText = styled(Text)`
  &:hover {
    color: ${props => props.theme.white};
    font-weight: 600;
  }
`
const TopRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`
export const BackArrowFormHeader = (props: {
  formValues: LoginFormType
  setStep: (LoginSteps) => void
}) => {
  return (
    <TopRow>
      <Icon
        cursor
        data-e2e='signupBack'
        name='arrow-left'
        size='24px'
        color='grey400'
        style={{ marginRight: '6px' }}
        role='button'
        onClick={() => props.setStep(LoginSteps.ENTER_EMAIL_GUID)}
      />
      <Text color='grey400' size='14px' weight={600}>
        <FormattedMessage
          id='scenes.login.signingin_email'
          defaultMessage='Signing in with {email}'
          values={{ email: props.formValues.guidOrEmail }}
        />
      </Text>
    </TopRow>
  )
}

export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const NeedHelpLink = () => (
  <LinkContainer to='/help'>
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage
        id='scenes.login.needhelp'
        defaultMessage='Need some help?'
      />
    </Link>
  </LinkContainer>
)
