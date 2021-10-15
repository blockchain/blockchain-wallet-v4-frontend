import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { FormLabel } from 'components/Form'
import { LoginFormType, LoginSteps } from 'data/types'

export const LOGIN_FORM_NAME = 'login'

export const removeWhitespace = (string) => string.replace(/\s/g, ``)

export const ActionButton = styled(Button)`
  margin-top: 15px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
export const Row = styled.div`
  display: flex;
`
export const CenterRow = styled.div`
  display: flex;
  justify-content: center;
`
export const CartridgeSentContainer = styled.div`
  width: auto;
`
export const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`
export const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`
export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '40px')};
  height: ${(props) => (props.size ? props.size : '40px')};
  min-width: ${(props) => (props.size ? props.size : '40px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue600)};
  border-radius: ${(props) => (props.size ? props.size : '40px')};
  margin-bottom: 8px;
`
export const RectangleBackground = styled.div`
  height: 48px;
  width: 100%;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
`
const TopRow = styled.div`
  display: flex;
  margin-bottom: 24px;
`
export const HelpRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
export const CenteredColumn = styled(Column)`
  align-items: center;
`
export const Loader = styled(SpinningLoader)`
  height: 75px;
  width: 75px;
  margin: 75px;
`
export const PhishingWarning = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${(props) => props.theme.whiteFade100};
  padding: 12px 32px;
`

export const BackArrowFormHeader = (props: {
  formValues: LoginFormType
  handleBackArrowClick: () => void
  hideBackArrow?: boolean
  hideGuid?: boolean
}) => {
  return (
    <>
      <TopRow>
        {!props.hideBackArrow && (
          <Icon
            cursor
            data-e2e='signupBack'
            name='arrow-left'
            size='24px'
            color='grey400'
            style={{ marginRight: '8px' }}
            role='button'
            onClick={() => props.handleBackArrowClick()}
          />
        )}
        <Column>
          {props.hideGuid || props.formValues.email ? (
            <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.signingin_email'
                defaultMessage='Signing in with {email}'
                values={{ email: props.formValues.email }}
              />
            </Text>
          ) : (
            <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scences.login.wallet_guid'
                defaultMessage='Wallet: {guid}'
                values={{ guid: props.formValues.guid }}
              />
            </Text>
          )}
          {props.formValues.step !== LoginSteps.CHECK_EMAIL &&
            props.formValues.email &&
            !props.hideGuid && (
              <Text size='12px' weight={500} color='grey400'>
                <FormattedMessage
                  id='scences.login.wallet_guid'
                  defaultMessage='Wallet: {guid}'
                  values={{ guid: props.formValues.guid }}
                />
              </Text>
            )}
        </Column>
      </TopRow>
    </>
  )
}

export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const NeedHelpLink = (props: { authActions; origin: string }) => (
  <LinkContainer to='/help' onClick={() => props.authActions.needHelpClicked(props.origin)}>
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)

export const UnsupportedBrowserWarning = () => (
  <BrowserWarning>
    <Banner type='warning'>
      <FormattedMessage
        id='scenes.login.browserwarning'
        defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
      />
    </Banner>
  </BrowserWarning>
)
