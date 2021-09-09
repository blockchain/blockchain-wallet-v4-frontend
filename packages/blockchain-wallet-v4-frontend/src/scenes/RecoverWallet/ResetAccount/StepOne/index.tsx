import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { RecoverSteps } from 'data/types'

import { ActionButton, BackArrowFormHeader, CircleBackground } from '../../model'
import { Props as OwnProps } from '..'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
class StepOne extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      firstResetAcccountPrompt: true
    }
  }

  handleResetAccountClick = () => {
    if (this.state.firstResetAcccountPrompt === true) {
      this.setState({ firstResetAcccountPrompt: false })
      this.props.authActions.resetAccountClicked('RESET_CONFIRMATION')
    } else {
      this.props.setFormStep()
      this.props.authActions.resetAccountClicked('RESET_FINAL_WARNING')
    }
  }

  handleGoBackClick = () => {
    if (this.state.firstResetAcccountPrompt === true) {
      this.props.setStep(RecoverSteps.RECOVERY_OPTIONS)
      this.props.authActions.resetAccountCancelled('RESET_CONFIRMATION')
    } else {
      this.setState({ firstResetAcccountPrompt: true })
      this.props.authActions.resetAccountCancelled('RESET_FINAL_WARNING')
    }
  }

  render() {
    const { emailFromMagicLink } = this.props
    return (
      <>
        <BackArrowFormHeader
          handleBackArrowClick={this.handleGoBackClick}
          email={emailFromMagicLink}
          step={RecoverSteps.RESET_ACCOUNT}
        />
        {this.state.firstResetAcccountPrompt && (
          <FormBody>
            <CircleBackground color='blue600' size='40px' style={{ marginTop: '16px' }}>
              <Icon name='sync-regular' color='white' size='20px' />
            </CircleBackground>
            <Text
              color='grey900'
              size='20px'
              weight={600}
              lineHeight='1.5'
              style={{ margin: '8px 0' }}
            >
              <FormattedMessage id='scenes.recovery.reset' defaultMessage='Reset Your Account?' />
            </Text>
            <Text
              color='grey900'
              size='16px'
              weight={500}
              lineHeight='1.5'
              style={{ textAlign: 'center' }}
            >
              <FormattedMessage
                id='scenes.recovery.resetting'
                defaultMessage='Resetting will restore your Trading, Interest, and Exchange accounts.'
              />
            </Text>
          </FormBody>
        )}
        {!this.state.firstResetAcccountPrompt && (
          <FormBody>
            <CircleBackground color='orange600' size='40px' style={{ marginTop: '16px' }}>
              <Icon name='alert-filled' color='white' size='20px' style={{ marginBottom: '2px' }} />
            </CircleBackground>
            <Text
              color='grey900'
              size='20px'
              weight={600}
              lineHeight='1.5'
              style={{ margin: '8px 0', textAlign: 'center' }}
            >
              <FormattedMessage
                id='sscenes.recovery.reset_warning_title'
                defaultMessage='Resetting Account May Result in Lost Funds'
              />
            </Text>
            <Text
              color='grey900'
              size='16px'
              weight={500}
              lineHeight='1.5'
              style={{ textAlign: 'center' }}
            >
              <FormattedMessage
                id='scenes.recovery.reset_warning_body'
                defaultMessage='This means that if you lose your recovery phrase, you will lose access to your Private Key Wallet funds. You can restore your Private Key Wallet funds later if you find your recovery phrase.'
              />
            </Text>
          </FormBody>
        )}
        <ActionButton
          nature='primary'
          fullwidth
          height='48px'
          data-e2e='resetAccountButton'
          style={{ margin: '24px 0 16px 0' }}
          onClick={this.handleResetAccountClick}
        >
          <FormattedMessage id='buttons.reset_account' defaultMessage='Reset Account' />
        </ActionButton>
      </>
    )
  }
}

type State = { firstResetAcccountPrompt: boolean }

type Props = {
  setFormStep: () => void
} & OwnProps

export default StepOne
