/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* stylelint-disable */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import { media, spacing } from 'services/styles'

import {
  IconContainer,
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary,
  SecurityTip
} from '../../components'
import Choices from './Choices'
import GoogleAuth from './GoogleAuth'
import SmsAuth from './SMS'
import Yubikey from './Yubikey'

const SecuritySummaryChoice = styled(SecuritySummary)`
  width: 100%;
  @media (min-width: 992px) {
    width: 120%;
  }
  ${media.mobile`
    padding: 15px 15px 10px 15px;
  `};
`
const SecurityTwoStepContainer = styled(SecurityContainer)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  grid-template-columns: 85% 15%;
  ${media.mobile`
    padding: 0;
  `};
`
const IconAndHeaderContainer = styled.div`
  opacity: ${(props) => (props.success ? 0.3 : 1)};
  @media (min-width: 480px) {
    display: grid;
    grid-template-columns: 15% 85%;
  }
`
const DisableContainer = styled.div`
  width: 100%;
  margin: 10px 0 20px;
  div:first-of-type {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  span.heavy {
    font-weight: 500;
  }
  a.link {
    cursor: pointer;
    color: ${(props) => props.theme.blue600};
  }
`
const DisableLinkContainer = styled.div`
  flex-direction: row;
  width: 100%;
`
const DisableLinkText = styled(Text)`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  margin-top: 10px;
  a {
    color: ${(props) => props.theme.blue600};
    cursor: pointer;
    padding-left: 3px;
  }
`
const TwoStepButton = styled(Button)`
  width: 100px;
  font-size: 12px;
  min-width: 0;
  @media (min-width: 400px) and (max-width: 991px) {
    font-size: 14px;
    width: 140px;
  }
  @media (min-width: 1224px) {
    width: 140px;
    min-width: 0;
    font-size: 14px;
  }
`
const Header = styled(SecurityHeader)`
  justify-content: flex-start;
  align-items: center;
  ${media.mobile`
    justify-content: space-between;
  `};
`
const TipText = styled(Text)`
  display: inline;
  font-size: 12px;

  & > * {
    display: inline;
  }
`
/* stylelint-enable */

const TwoStepVerification = (props) => {
  const { data, editing, handleClick, handleGoBack, twoStepChoice, uiState, ...rest } = props
  const { authType, smsNumber, smsVerified } = data
  const twoFAEnabled = authType > 0

  const renderVerificationChoice = () => {
    if (twoStepChoice === 'google') {
      return <GoogleAuth goBackOnSuccess={handleClick} {...rest} />
    }
    if (twoStepChoice === 'yubikey') {
      return <Yubikey goBackOnSuccess={handleClick} {...rest} />
    }
    if (twoStepChoice === 'sms') {
      return <SmsAuth goBackOnSuccess={handleClick} {...rest} />
    }
    return (
      <SecuritySummaryChoice>
        <Choices
          authType={authType}
          editing={editing}
          chooseMethod={props.chooseMethod}
          pulseText={props.pulseText}
        />
        <Button nature='empty' onClick={props.handleClick}>
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
      </SecuritySummaryChoice>
    )
  }

  const renderDisable = () => {
    if (uiState.verifyToggled) {
      if (authType > 0 && authType !== 5) {
        return (
          <>
            <div />
            <DisableLinkContainer style={spacing('pl-25')}>
              <DisableLinkText size='14px' weight={400} flexRow='true' pulse={props.pulse}>
                <FormattedMessage
                  id='scenes.security.2fa.disablefirst'
                  defaultMessage='To change your Two-Factor Authentication method, disable your current one first. {link}'
                  values={{
                    link: <a onClick={props.handleTwoFactorChange}>Disable {props.authName}</a>
                  }}
                />
              </DisableLinkText>
            </DisableLinkContainer>
          </>
        )
      }
      if (authType === 5 && smsVerified) {
        return (
          <>
            <div />
            <DisableContainer style={spacing('pl-25')}>
              <Text weight={400} size='14px'>
                <FormattedMessage
                  id='scenes.security.2fa.sms.success'
                  defaultMessage='Two-factor authentication is set up with {authName} for number {number}.'
                  values={{
                    authName: <span className='heavy'>{props.authName}</span>,
                    number: <span className='heavy'>{smsNumber}</span>
                  }}
                />
              </Text>
              <DisableLinkText size='14px' weight={400} flexRow='true' pulse={props.pulse}>
                <FormattedMessage
                  id='scenes.security.2fa.sms.disablefirst'
                  defaultMessage='To change your Two-Factor Authentication method,{link} SMS codes first.'
                  values={{
                    link: <a onClick={props.handleTwoFactorChange}>disable</a>
                  }}
                />
              </DisableLinkText>
            </DisableContainer>
          </>
        )
      }
    }
  }

  const renderDescription = () => {
    if (!twoFAEnabled) {
      return (
        <>
          <Text size='14px'>
            <FormattedMessage
              id='scenes.security.twostepverification.description'
              defaultMessage='Use an Authenticator app, Yubikey, or SMS Codes'
            />
          </Text>
          <br />
          <FormattedMessage
            id='scenes.security.twostepverification.description2'
            defaultMessage='Two-Factor Authentication helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. Enable this to further secure your wallet.'
          />
        </>
      )
    }
    return (
      <FormattedMessage
        id='scenes.security.twostepverification.description3'
        defaultMessage='Two-Factor Authentication helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. You can disable this here if you would like to change your phone number or switch the type of Two-Factor Authentication you are using.'
      />
    )
  }
  const goBackLink = () => (
    <Link size='14px' onClick={handleGoBack}>
      <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
    </Link>
  )

  const renderHeader = () => {
    if (twoStepChoice === 'google') {
      return (
        <>
          <FormattedMessage
            id='scenes.security.twostepverification.authenticator.title'
            defaultMessage='Two-Factor Authentication - Authenticator App'
          />
          {goBackLink()}
        </>
      )
    }
    if (twoStepChoice === 'yubikey') {
      return (
        <>
          <FormattedMessage
            id='scenes.security.twostepverification.yubi.title'
            defaultMessage='Two-Factor Authentication - Yubikey'
          />
          {goBackLink()}
        </>
      )
    }
    if (twoStepChoice === 'sms') {
      return (
        <>
          <FormattedMessage
            id='scenes.security.twostepverification.mobile.title'
            defaultMessage='Two-Factor Authentication - Mobile Phone Number'
          />
          {goBackLink()}
        </>
      )
    }
    return (
      <FormattedMessage
        id='scenes.security.email.unverified.title'
        defaultMessage='Two-Factor Authentication'
      />
    )
  }

  const renderChoices = () => (!uiState.verifyToggled ? null : renderVerificationChoice())

  return (
    <>
      <SecurityTwoStepContainer>
        <IconAndHeaderContainer success={uiState.success}>
          <IconContainer>
            <SecurityIcon name='lock' enabled={twoFAEnabled} />
          </IconContainer>
          <SecuritySummary>
            <Header>{renderHeader()}</Header>
            <SecurityDescription>{renderDescription()}</SecurityDescription>
          </SecuritySummary>
          {renderDisable()}
        </IconAndHeaderContainer>
        {!uiState.verifyToggled && (
          <SecurityComponent>
            {!twoFAEnabled && (
              <TwoStepButton nature='primary' onClick={props.handleClick}>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable'
                  defaultMessage='Enable'
                />
              </TwoStepButton>
            )}
            {twoFAEnabled && (
              <TwoStepButton nature='primary' onClick={props.handleDisableClick}>
                <FormattedMessage
                  id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable'
                  defaultMessage='Disable'
                />
              </TwoStepButton>
            )}
          </SecurityComponent>
        )}
        {uiState.verifyToggled && <div />}

        {renderChoices()}
      </SecurityTwoStepContainer>
      {uiState.verifyToggled && (
        <SecurityTip>
          <TipText weight={400} size='12px'>
            <FormattedMessage
              id='scenes.securitycenter.2fa.tip'
              defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet. We recommend using Google Authenticator (available for '
            />
            <Link
              href='https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8'
              target='_blank'
              rel='noopener noreferrer'
              size='12px'
            >
              <span>&nbsp;iOS&nbsp;</span>
            </Link>
            <FormattedMessage id='scenes.securitycenter.2fa.tip.two' defaultMessage=' and ' />
            <Link
              href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en'
              target='_blank'
              rel='noopener noreferrer'
              size='12px'
            >
              <span>&nbsp;Android</span>
            </Link>
            <FormattedMessage id='scenes.securitycenter.2fa.tip.three' defaultMessage=').' />
          </TipText>
        </SecurityTip>
      )}
    </>
  )
}

TwoStepVerification.propTypes = {
  authType: PropTypes.number,
  smsVerified: PropTypes.number,
  twoStepChoice: PropTypes.string
}

export default reduxForm({
  form: 'twoStepVerification'
})(TwoStepVerification)
