import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Icon, Link, ButtonGroup } from 'blockchain-info-components'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
import { PhoneNumberBox } from 'components/Form'
import GoogleAuth from './GoogleAuth'
import Yubikey from './Yubikey'
import SmsAuth from './SMS'

const TwoStepChoicesWapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const Choice = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  opacity: ${props => props.selected && props.editing ? 1 : !props.editing ? 1 : 0.3};
  div * {
    cursor: pointer;
  }
  
`
const ChoiceDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
`
const SecuritySummaryChoice = styled(SecuritySummary)`
  width: 120%;
`
const SecurityTip = styled.div`
  border-left: 1px solid #CCCCCC;
  border-right: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
  padding: 20px;
  width: 95%;
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
  a:last-of-type {
    margin-top: 20px;
    margin-left: 0px;
  }
  div:first-of-type {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
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

const TwoStepVerification = (props) => {
  const { ui, twoStepChoice, data, editing } = props
  const { smsVerified, authType, smsNumber } = data
  const twoFAEnabled = authType > 0

  const renderVerificationChoice = () => {
    if (twoStepChoice === 'google') {
      return <GoogleAuth goBack={props.handleGoBack} />
    }
    if (twoStepChoice === 'yubikey') {
      return <Yubikey goBack={props.handleGoBack} />
    }
    if (twoStepChoice === 'sms') {
      return <SmsAuth goBack={props.handleGoBack} />
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
                <WeightedText>{props.authName}&nbsp;</WeightedText>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage=' for number ' />
                {
                  !ui.changeNumberToggled
                    ? <FlexRow><WeightedText>&nbsp;{smsNumber}</WeightedText>
                      <Text color='brand-secondary' cursor='pointer' size='14px' onClick={props.handleChangeNumber}>Change Mobile Number</Text>
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
              <Link weight={200} size='14px' onClick={props.handleTwoFactorChange}>Change Two-factor Authentication</Link>
            </DisableContainer>
            : authType === 4 || authType === 1 || authType === 2
              ? <DisableContainer>
                <Text weight={200} size='14px'>
                  <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-step Verification is set up with' />
                  <WeightedText>{props.authName}</WeightedText>
                </Text>
                <Link weight={200} size='14px' onClick={props.handleTwoFactorChange}>Change Two-factor Authentication</Link>
              </DisableContainer>
            : null
        }
        <TwoStepChoicesWapper>
          <Choice editing={editing} selected={authType === 4} onClick={() => props.chooseMethod('google')}>
            <Icon name='lock' size='18px' weight={400} />
            <ChoiceDescription>
              <Text weight={300} size='16px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Authenticator App' />
              </Text>
              <Text weight={200} size='12px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use App generated codes' />
              </Text>
            </ChoiceDescription>
          </Choice>
          <Choice editing={editing} selected={authType === 1} onClick={() => props.chooseMethod('yubikey')}>
            <Icon name='yubikey' />
            <ChoiceDescription>
              <Text weight={300} size='16px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Yubikey' />
              </Text>
              <Text weight={200} size='12px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Pair with your Yubikey' />
              </Text>
            </ChoiceDescription>
          </Choice>
          <Choice editing={editing} selected={authType === 5} onClick={() => props.chooseMethod('sms')}>
            <Icon name='mobile' size='18px' weight={400} />
            <ChoiceDescription>
              <Text weight={300} size='16px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Mobile Phone Number' />
              </Text>
              <Text weight={200} size='12px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use codes sent via SMS' />
              </Text>
            </ChoiceDescription>
          </Choice>
        </TwoStepChoicesWapper>
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
          <Text>
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
          !ui.verifyToggled
            ? renderInitial()
            : renderVerificationChoice()
        }
        {
          !ui.verifyToggled
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
        ui.verifyToggled
          ? <SecurityTip>
            <Text color='brand-primary' size='12px' weight={500}>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Security Tip' />
            </Text>
            <Text weight={200} size='12px'>
              <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet. We recommend using Google Authenticator (available for <make into links> iOS and Android).' />
            </Text>
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
