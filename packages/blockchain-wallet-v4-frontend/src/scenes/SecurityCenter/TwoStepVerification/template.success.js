import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Link, ButtonGroup } from 'blockchain-info-components'
import styled, { keyframes } from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary, SecurityTip } from 'components/Security'
import { PhoneNumberBox } from 'components/Form'
import GoogleAuth from './GoogleAuth'
import Yubikey from './Yubikey'
import SmsAuth from './SMS'
import { pulse } from 'react-animations'
import Choices from '../Components/Choices/index'

const pulseAnimation = keyframes`${pulse}`

const SecuritySummaryChoice = styled(SecuritySummary)`
  width: 120%;
`
const SecurityTwoStepContainer = SecurityContainer.extend`
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
`
const DisableContainer = styled.div`
  width: 100%;
  margin: 10px 0px 20px 0px;
  div:first-of-type {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
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
    padding-left: 3px;
  }
  animation: 0.5s ${props => props.pulse ? `${pulseAnimation}` : null};
`
const DisableSMSLinkText = DisableLinkText.extend`
  margin-top: 20px;
`
const WeightedText = styled.span`
  font-weight: 400;
  font-size: 14px;
`
const ChangeMobileContainer = styled.form`
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  input {
    min-height: 15px;
    padding: 0px 5px;
  }
  button {
    height: 25px;
    font-size: 12px;
    padding: 0px;
  }
`
const FlexRow = styled.span`
  display: flex;
  flex-direction: row;
`
const Buttons = styled(ButtonGroup)`
  button {
    margin-left: 10px;
  }
`
const TipText = styled(Text)`
  display: flex;
  flex-direction: row;
`

const TwoStepVerification = (props) => {
  const { ui, twoStepChoice, data, editing, ...rest } = props
  const { smsVerified, authType, smsNumber } = data
  const twoFAEnabled = authType > 0

  const renderVerificationChoice = () => {
    if (twoStepChoice === 'google') {
      return <GoogleAuth goBack={props.handleGoBack} {...rest} />
    }
    if (twoStepChoice === 'yubikey') {
      return <Yubikey goBack={props.handleGoBack} {...rest} />
    }
    if (twoStepChoice === 'sms') {
      return <SmsAuth goBack={props.handleGoBack} {...rest} />
    }
    return (
      <SecuritySummaryChoice>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Two-Step Verification' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time passsword after every login attempt. Enabling this option helps keep unauthorized users form being able to access your wallet.' />
        </SecurityDescription>
        {
          authType === 5 && smsVerified
            ? <DisableContainer>
              <Text weight={200} size='14px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-step Verification is set up with' />
                <WeightedText>&nbsp;{props.authName}&nbsp;</WeightedText>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage=' for number ' />
                {
                  !ui.changeNumberToggled
                    ? <FlexRow><WeightedText>&nbsp;{smsNumber}</WeightedText>
                      <Text color='brand-secondary' cursor='pointer' size='14px' onClick={props.handleChangeNumber}>&nbsp;Change Mobile Number</Text>
                    </FlexRow>
                    : <ChangeMobileContainer>
                      <Field name='mobileNumber' minHeight='25px' component={PhoneNumberBox} placeholder='212-555-5555' />
                      <Buttons>
                        <Text cursor='pointer' weight={200} size='12px' onClick={props.cancelMobileChange} height='25px'>Cancel</Text>
                        <Button nature='primary' onClick={props.submitMobileChange} height='25px'>Change</Button>
                      </Buttons>
                    </ChangeMobileContainer>
                }
              </Text>
              <DisableSMSLinkText size='14px' weight={200} flexRow='true'>
                <FormattedMessage id='scenes.security.2fa.disablefirst' defaultMessage='To change your Two-Step verification method, disable your current one first.' />
                <Link weight={200} size='14px' onClick={props.handleTwoFactorChange}>Disable {props.authName}</Link>
              </DisableSMSLinkText>
            </DisableContainer>
            : authType === 4 || authType === 1 || authType === 2
              ? <DisableLinkContainer>
                <DisableLinkText size='14px' weight={300} flexRow='true' pulse={props.pulse}>
                  <FormattedMessage id='scenes.security.2fa.disablefirst' defaultMessage='To change your Two-Step verification method, disable your current one first.' />
                  <Link weight={200} size='14px' onClick={props.handleTwoFactorChange}>Disable {props.authName}</Link>
                </DisableLinkText>
              </DisableLinkContainer>
              : null
        }
        {/* component for the three 2FA choices */}
        <Choices authType={authType} editing={editing} chooseMethod={props.chooseMethod} pulseText={props.pulseText} />
      </SecuritySummaryChoice>
    )
  }

  const renderInitial = () => {
    return (
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification' />
        </SecurityHeader>
        <SecurityDescription>
          <Text size='14px'>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Use Google Authenticator, Yubikey, or SMS Codes' />
          </Text>
          <br />
          <FormattedMessage id='scenes.security.twostepverification.description2' defaultMessage='Two-Step Verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. You can disable this here if you’d like to change your phone number or switch the type of Two-Step Verification you’re using.' />
        </SecurityDescription>
      </SecuritySummary>
    )
  }

  return (
    <div>
      <SecurityTwoStepContainer>
        <IconContainer>
          <SecurityIcon name='lock' enabled={twoFAEnabled} />
        </IconContainer>
        {
          !ui.verifyToggled && !props.alone
            ? renderInitial()
            : renderVerificationChoice()
        }
        {
          !ui.verifyToggled && !props.alone
            ? <SecurityComponent>
              {
                !twoFAEnabled
                  ? <Button nature='primary' onClick={props.handleClick} >
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Enable' />
                  </Button>
                  : <Button nature='primary' onClick={props.handleDisableClick} >
                    <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable' defaultMessage='Edit' />
                  </Button>
              }
            </SecurityComponent>
            : null
        }
      </SecurityTwoStepContainer>
      {
        ui.verifyToggled || props.alone
          ? <SecurityTip>
            <Text color='brand-primary' size='12px' weight={500}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Security Tip' />
            </Text>
            <TipText weight={200} size='12px'>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet. We recommend using Google Authenticator (available for' />
              <Link weight={200} size='12px' href='https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8' _target='blank' rel='noopener noreferrer'>&nbsp;iOS&nbsp;</Link>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.and' defaultMessage='and' />
              <Link weight={200} size='12px' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en' _target='blank' rel='noopener noreferrer'>&nbsp;Android</Link>
              <FormattedMessage id='none' defaultMessage=').' />
            </TipText>
          </SecurityTip>
          : null
      }
    </div>
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
