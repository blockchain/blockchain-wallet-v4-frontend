import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics, RecoverSteps } from 'data/types'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'
import {
  ActionButton,
  BackArrowFormHeader,
  CircleBackground,
  FormWrapper,
  SubCard,
  TryAnotherMethodRow
} from '../../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MobileText = styled(Text)`
  ${media.mobile`
font-size: 14px;
margin-bottom: 12px;
`}
`
const ResetWarning: React.FC<Props> = (props: Props) => {
  const handleResetAccountClick = () => {
    const { accountRecoveryData, analyticsActions, setStep } = props
    // will be 0 if no 2fa
    if (accountRecoveryData?.two_fa_type) {
      if (accountRecoveryData?.two_fa_type === 5) {
        props.signupActions.triggerSmsVerificationRecovery()
        // trigger sms challenge
      } else {
        setStep(RecoverSteps.TWO_FA_CONFIRMATION)
      }
    } else {
      setStep(RecoverSteps.NEW_PASSWORD)
    }
    analyticsActions.trackEvent({
      key: Analytics.RECOVERY_RESET_ACCOUNT_CLICKED,
      properties: {
        origin: 'RESET_FINAL_WARNING',
        site_redirect: 'WALLET'
      }
    })
  }
  const { accountRecoveryData, setStep } = props
  return (
    <FormWrapper>
      <BackArrowFormHeader
        handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
        email={accountRecoveryData?.email}
        step={RecoverSteps.RESET_ACCOUNT}
      />

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
            id='scenes.recovery.reset_warning_titletext'
            defaultMessage='This method only restores your 
            Trading and Earn Accounts'
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
            id='scenes.recovery.reset_warning_bodytext'
            defaultMessage='To restore your Private Key Wallet (DeFi Wallet), please use your cloud backup or recovery phrase.'
          />
        </Text>
      </FormBody>

      <ActionButton
        nature='primary'
        fullwidth
        height='48px'
        data-e2e='resetAccountButton'
        style={{ margin: '24px 0 16px 0' }}
        onClick={handleResetAccountClick}
      >
        <FormattedMessage
          id='buttons.reset_trading_account'
          defaultMessage='Restore Trading and Earn Account'
        />
      </ActionButton>
      <SubCard>
        <TryAnotherMethodRow>
          <MobileText
            size='14px'
            weight={600}
            color='blue600'
            data-e2e='loginGetHelp'
            style={{ cursor: 'pointer', marginTop: '16px' }}
            onClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
          >
            <FormattedMessage id='copy.try_another' defaultMessage='Try Another Method' />
          </MobileText>
        </TryAnotherMethodRow>
      </SubCard>
    </FormWrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ResetWarning)
