import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics, RecoverSteps } from 'data/types'

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
      firstResetAccountPrompt: true
    }
  }

  handleResetAccountClick = () => {
    const { analyticsActions, setFormStep } = this.props

    if (this.state.firstResetAccountPrompt) {
      this.setState({ firstResetAccountPrompt: false })
      analyticsActions.trackEvent({
        key: Analytics.RECOVERY_RESET_ACCOUNT_CLICKED,
        properties: {
          origin: 'RESET_CONFIRMATION',
          site_redirect: 'WALLET'
        }
      })
    } else {
      setFormStep()
      analyticsActions.trackEvent({
        key: Analytics.RECOVERY_RESET_ACCOUNT_CLICKED,
        properties: {
          origin: 'RESET_FINAL_WARNING',
          site_redirect: 'WALLET'
        }
      })
    }
  }

  handleGoBackClick = () => {
    const { analyticsActions, setStep } = this.props

    if (this.state.firstResetAccountPrompt) {
      setStep(RecoverSteps.RECOVERY_OPTIONS)
      analyticsActions.trackEvent({
        key: Analytics.RECOVERY_RESET_ACCOUNT_CANCELLED,
        properties: {
          origin: 'RESET_CONFIRMATION',
          site_redirect: 'WALLET'
        }
      })
    } else {
      this.setState({ firstResetAccountPrompt: true })
      analyticsActions.trackEvent({
        key: Analytics.RECOVERY_RESET_ACCOUNT_CANCELLED,
        properties: {
          origin: 'RESET_FINAL_WARNING',
          site_redirect: 'WALLET'
        }
      })
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
        {this.state.firstResetAccountPrompt && (
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
                defaultMessage='Resetting will restore your Trading, Rewards, and Exchange accounts.'
              />
            </Text>
          </FormBody>
        )}
        {!this.state.firstResetAccountPrompt && (
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
                id='scenes.recovery.reset_warning_title'
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type State = { firstResetAccountPrompt: boolean }

type Props = {
  setFormStep: () => void
} & OwnProps &
  ConnectedProps<typeof connector>

export default connector(StepOne)
