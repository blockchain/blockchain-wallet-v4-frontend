import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Link } from 'blockchain-info-components'
import styled, { keyframes } from 'styled-components'
import { reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary, SecurityTip, IconContainer } from 'components/Security'
import GoogleAuth from './GoogleAuth'
import Yubikey from './Yubikey'
import SmsAuth from './SMS'
import { pulse } from 'react-animations'
import Choices from '../Components/Choices/index'
import { spacing } from 'services/StyleService'

const pulseAnimation = keyframes`${pulse}`

const SecuritySummaryChoice = styled(SecuritySummary)`
  width: 120%;
`
const SecurityTwoStepContainer = SecurityContainer.extend`
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  grid-template-columns: 85% 15%;
`
const IconAndHeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
  opacity: ${props => props.success ? 0.3 : 1};
`
const DisableContainer = styled.div`
  width: 100%;
  margin: 10px 0px 20px 0px;
  div:first-of-type {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  span.heavy {
    font-weight: 400;
  }
  a.link {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']}
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
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
    padding-left: 3px;
  }
  animation: 0.5s ${props => props.pulse ? pulseAnimation : null};
`
const Header = SecurityHeader.extend`
  justify-content: flex-start;
  align-items: center;
`
const TipText = styled(Text)`
text-align: justify;
display: inline;
font-size: 12px;

& > * { display: inline; }
`

const TwoStepVerification = (props) => {
  const { ui, twoStepChoice, data, editing, success, ...rest } = props
  const { smsVerified, authType, smsNumber } = data
  const twoFAEnabled = authType > 0

  const renderVerificationChoice = () => {
    if (twoStepChoice === 'google') {
      return <GoogleAuth {...rest} />
    }
    if (twoStepChoice === 'yubikey') {
      return <Yubikey {...rest} />
    }
    if (twoStepChoice === 'sms') {
      return <SmsAuth {...rest} />
    }
    return (
      <SecuritySummaryChoice>
        <Choices authType={authType} editing={editing} chooseMethod={props.chooseMethod} pulseText={props.pulseText} />
      </SecuritySummaryChoice>
    )
  }

  const renderDisable = () => {
    if (ui.verifyToggled) {
      if (authType > 0 && authType !== 5) {
        return (
          <React.Fragment>
            <div />
            <DisableLinkContainer style={spacing('pl-25')}>
              <DisableLinkText size='14px' weight={300} flexRow='true' pulse={props.pulse}>
                <FormattedMessage id='scenes.security.2fa.disablefirst' defaultMessage='To change your two-factor authentication method, disable your current one first. {link}' values={{ link: <a onClick={props.handleTwoFactorChange}>Disable {props.authName}</a> }} />
              </DisableLinkText>
            </DisableLinkContainer>
          </React.Fragment>
        )
      }
      if (authType === 5 && smsVerified) {
        return (
          <React.Fragment>
            <div />
            <DisableContainer style={spacing('pl-25')}>
              <Text weight={200} size='14px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-factor authentication is set up with {authName} for number {number}.' values={{ authName: <span className='heavy'>{props.authName}</span>, number: <span className='heavy'>{smsNumber}</span> }} />
              </Text>
              <DisableLinkText size='14px' weight={300} flexRow='true' pulse={props.pulse}>
                <FormattedMessage id='scenes.security.2fa.disablefirst' defaultMessage='To change your two-factor authentication method,{link} first. ' values={{ link: <a onClick={props.handleTwoFactorChange}>disable {props.authName}</a> }} />
              </DisableLinkText>
            </DisableContainer>
          </React.Fragment>
        )
      }
    }
  }

  const renderDescription = () => {
    if (!twoFAEnabled && !props.alone) {
      return (
        <React.Fragment>
          <Text size='14px'>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Use an Authenticator app, Yubikey, or SMS Codes' />
          </Text>
          <br />
          <FormattedMessage id='scenes.security.twostepverification.description2' defaultMessage='Two-step verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. Enable this to further secure your wallet.' />
        </React.Fragment>
      )
    }
    return <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Two-step verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. You can disable this here if you would like to change your phone number or switch the type of Two-Step Verification you are using.' />
  }

  const renderHeader = () => {
    if (twoStepChoice === 'google') {
      return (
        <React.Fragment>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Authenticator App' />
          <Link size='14px' onClick={props.handleGoBack}>Change</Link>
        </React.Fragment>
      )
    }
    if (twoStepChoice === 'yubikey') {
      return (
        <React.Fragment>
          <FormattedMessage id='scenes.security.twostepverification.yubi.title' defaultMessage='Two-Step Verification - Yubikey' />
          <Link size='14px' onClick={props.handleGoBack}>Change</Link>
        </React.Fragment>
      )
    }
    if (twoStepChoice === 'sms') {
      return (
        <React.Fragment>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification - Mobile Phone Number' />
          <Link size='14px' onClick={props.handleGoBack}>Change</Link>
        </React.Fragment>
      )
    }
    return <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Two-Step Verification' />
  }

  const renderChoices = () => !ui.verifyToggled && !props.alone ? null : renderVerificationChoice()

  return (
    <Fragment>
      <SecurityTwoStepContainer>
        <IconAndHeaderContainer success={ui.success}>
          <IconContainer>
            <SecurityIcon name='lock' enabled={twoFAEnabled} />
          </IconContainer>
          <SecuritySummary>
            <Header>
              { renderHeader() }
            </Header>
            <SecurityDescription>
              { renderDescription() }
            </SecurityDescription>
          </SecuritySummary>
          { renderDisable() }
        </IconAndHeaderContainer>
        {
          !ui.verifyToggled && !props.alone
            ? <SecurityComponent>
              {
                !twoFAEnabled
                  ? <Button nature='primary' onClick={props.handleClick} >
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Enable' />
                  </Button>
                  : <Button nature='primary' onClick={props.handleDisableClick} >
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable' defaultMessage='Disable' />
                  </Button>
              }
            </SecurityComponent>
            : <div />
        }
        { renderChoices() }
      </SecurityTwoStepContainer>
      {
        ui.verifyToggled || props.alone
          ? <SecurityTip>
            <Text color='brand-primary' size='12px' weight={500}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Security Tip' />
            </Text>
            <TipText weight={200} size='12px'>
              <FormattedMessage id='scenes.securitycenter.2fa.tip' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet. We recommend using Google Authenticator (available for ' />
              <Link href='https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8' _target='blank' rel='noopener noreferrer' size='12px'>iOS</Link>
              <FormattedMessage id='scenes.securitycenter.2fa.tip.two' defaultMessage=' and ' />
              <Link href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en' _target='blank' rel='noopener noreferrer' size='12px'>Android</Link>
              <FormattedMessage id='scenes.securitycenter.2fa.tip.three' defaultMessage=').' />
            </TipText>
          </SecurityTip>
          : null
      }
    </Fragment>
  )
}

TwoStepVerification.propTypes = {
  authType: PropTypes.number,
  twoStepChoice: PropTypes.string,
  smsVerified: PropTypes.number
}

export default reduxForm({
  form: 'twoStepVerification'
})(TwoStepVerification)
