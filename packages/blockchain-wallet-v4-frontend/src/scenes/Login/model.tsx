import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Icon, Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import { FormLabel } from 'components/Form'
import { LoginFormType, LoginSteps } from 'data/types'

export const LOGIN_FORM_NAME = 'login'

export const removeWhitespace = (string) => string.replace(/\s/g, ``)

export const ActionButton = styled(Button)`
  margin-top: 15px;
`
export const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
export const Row = styled.div`
  display: flex;
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
export const CircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background-color: ${(props) => props.theme.blue600};
  border-radius: 40px;
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
}) => {
  return (
    <>
      <TopRow>
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
        <Column>
          {props.formValues.email ? (
            <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.signingin_email'
                defaultMessage='Signing in with {email}'
                values={{ email: props.formValues.email }}
              />
            </Text>
          ) : props.formValues.email ? (
            <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.recovery.email'
                defaultMessage='Recovering {email}'
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
          {props.formValues.step !== LoginSteps.CHECK_EMAIL && props.formValues.email && (
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

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0 32px;
`
const SignUpText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`

export const CreateAccount = () => {
  return (
    <LinkContainer data-e2e='signupLink' to='/signup'>
      <Link>
        <SubCard>
          <Text size='16px' color='grey400' weight={500}>
            <FormattedMessage
              id='scenes.login.account_signup'
              defaultMessage="Don't have a Blockchain Account?"
            />
          </Text>
          &nbsp;
          <SignUpText size='16px' color='white' weight={600}>
            <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
          </SignUpText>
        </SubCard>
      </Link>
    </LinkContainer>
  )
}
