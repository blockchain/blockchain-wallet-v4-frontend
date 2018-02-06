import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text, Button, Icon } from 'blockchain-info-components'
import styled from 'styled-components'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
// import Settings from './Settings'

const TwoStepChoicesWapper = styled.div`
  display: flex;
  flex-direction: row;
`
const Choice = styled.div`
  display: flex;
  flex-direction: row;
`
const ChoiceDescription = styled.div`
  display: flex;
  flex-direction: column;
`

const TwoStepVerification = (props) => {
  const { authType, ui } = props
  const twoFAEnabled = authType === 1

  // console.log('2step', props)

  const renderVerificationChoice = () => {
    return (
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.email.unverifiedtitle' defaultMessage='Two-Step Verification' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Two-step Verification helps prevent unauthorized access to your wallet by requiring a one-time passsword after every login attempt. Enabling this option helps keep unauthorized users form being able to access your wallet.' />
        </SecurityDescription>
        <TwoStepChoicesWapper>
          <Choice>
            <Icon name='lock' />
            <ChoiceDescription>
              <Text weight='200' size='14px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Authenticator App' />
              </Text>
              <Text weight='200' size='14px'>
                <FormattedMessage id='scenes.security.email.verifyemailaddress' defaultMessage='Use App generated codes' />
              </Text>
            </ChoiceDescription>
          </Choice>
          <Choice>
            <Icon name='yubikey' />
          </Choice>
          <Choice>
            <Icon name='mobile' />
          </Choice>  
        </TwoStepChoicesWapper>
      </SecuritySummary>
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
    <SecurityContainer>
      <SecurityIcon name='lock' enabled={twoFAEnabled} />
      {
        !ui.verifyToggled
          ? renderInitial()
          : renderVerificationChoice()
      }
      <SecurityComponent>
        <Button nature='primary' onClick={props.handleClick}>
          { authType === 0
            ? <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.enable' defaultMessage='Enable' />
            : <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.settings.disable' defaultMessage='Disable' />
          }
        </Button>
      </SecurityComponent>
    </SecurityContainer>
  )
}

TwoStepVerification.propTypes = {
  authType: PropTypes.number.isRequired
}

export default TwoStepVerification
