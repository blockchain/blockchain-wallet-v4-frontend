import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Icon } from 'blockchain-info-components'
import styled from 'styled-components'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
import Settings from './Settings'
import GoogleAuth from './GoogleAuth'
import Yubikey from './Yubikey'

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
`
const ChoiceDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
`
const SecuritySummaryChoice = styled(SecuritySummary)`
  width: 80%;
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

const TwoStepVerification = (props) => {
  const { authType, ui, twoStepChoice } = props
  const twoFAEnabled = authType === 1

  const renderVerificationChoice = () => {
    if (twoStepChoice === 'google') {
      return (
        <GoogleAuth goBack={props.handleGoBack} />
      )
    }
    if (twoStepChoice === 'yubikey') {
      return (
        <Yubikey goBack={props.handleGoBack} />
      )
    }
    // if (twoStepChoice === 'sms') {
    //   return
    // }
    return (
      <SecuritySummaryChoice>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Two-Step Verification' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time passsword after every login attempt. Enabling this option helps keep unauthorized users form being able to access your wallet.' />
        </SecurityDescription>
        <TwoStepChoicesWapper>
          <Choice onClick={() => props.chooseMethod('google')}>
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
          <Choice onClick={() => props.chooseMethod('yubikey')}>
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
          <Choice>
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
        <SecurityIcon name='lock' enabled={twoFAEnabled} />
        {
          !ui.verifyToggled
            ? renderInitial()
            : renderVerificationChoice()
        }
        {
          !ui.verifyToggled
            ? <SecurityComponent>
              <Button nature='primary' onClick={props.handleClick}>
                {authType === 0
                  ? <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Enable' />
                  : <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable' defaultMessage='Disable' />
                }
              </Button>
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
  authType: PropTypes.number.isRequired
}

export default TwoStepVerification
