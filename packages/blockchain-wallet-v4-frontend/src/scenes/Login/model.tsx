import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import Bowser from 'bowser'
import styled from 'styled-components'

import { Button, Icon, Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import { FormLabel } from 'components/Form'
import { Wrapper } from 'components/Public'
import { LoginFormType, LoginSteps } from 'data/types'

export const LOGIN_FORM_NAME = 'login'

export const removeWhitespace = (string) => string.replace(/\s/g, ``)
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
export const BrowserWarning = styled.div`
  margin-bottom: 10px;
`

export const CartridgeSentContainer = styled.div`
  width: auto;
`

export const PublicWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
`
export const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
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
export const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 8px;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
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
  align-items: flex-end;
`

export const NeedHelpLink = () => (
  <LinkContainer to='/help'>
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='scenes.login.needhelp' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)
