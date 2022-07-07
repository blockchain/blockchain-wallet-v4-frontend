import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics, RecoverSteps } from 'data/types'
import { media } from 'services/styles'

import { Props as OwnProps } from '..'
import {
  BackArrowFormHeader,
  CircleBackground,
  GoBackArrow,
  OuterWrapper,
  RECOVER_FORM,
  WrapperWithPadding
} from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`
const RecoveryOptionRow = styled(IconTextRow)<{ hasCloudBackup?: boolean }>`
  cursor: ${(props) => (props.hasCloudBackup ? 'pointer' : 'not-allowed')};
  ${media.mobile`
  margin-bottom: 16px;
  `}
`
const TextStack = styled.div`
  max-width: 312px;
`

const RecoveryOptions = (props: Props) => {
  const {
    analyticsActions,
    cachedGuid,
    emailFromMagicLink,
    formActions,
    hasCloudBackup,
    lastGuid,
    nabuId,
    product,
    routerActions
  } = props
  const optionDisabledColor = hasCloudBackup ? 'grey900' : 'grey100'

  const cloudRecoveryClicked = () => {
    if (hasCloudBackup) {
      formActions.change(RECOVER_FORM, 'step', RecoverSteps.CLOUD_RECOVERY)
      analyticsActions.trackEvent({
        key: Analytics.LOGIN_RECOVERY_OPTION_SELECTED,
        properties: {
          recovery_type: 'CLOUD_BACKUP',
          site_redirect: 'WALLET'
        }
      })
    }
  }
  const recoveryPhraseClicked = () => {
    formActions.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_PHRASE)
    analyticsActions.trackEvent({
      key: Analytics.LOGIN_RECOVERY_OPTION_SELECTED,
      properties: {
        recovery_type: 'RECOVERY_PHRASE',
        site_redirect: 'WALLET'
      }
    })
  }

  const resetAccountClicked = () => {
    formActions.change(RECOVER_FORM, 'step', RecoverSteps.RESET_ACCOUNT)
    analyticsActions.trackEvent({
      key: Analytics.RECOVERY_RESET_ACCOUNT_CLICKED,
      properties: {
        recovery_type: 'RECOVERY_OPTIONS',
        site_redirect: 'WALLET'
      }
    })
  }

  return (
    <OuterWrapper>
      <WrapperWithPadding>
        {emailFromMagicLink && (
          <BackArrowFormHeader
            handleBackArrowClick={() => routerActions.push(`/login?product=${product}`)}
            email={emailFromMagicLink}
            guid={cachedGuid || lastGuid}
          />
        )}
        {!emailFromMagicLink && (
          <GoBackArrow
            handleBackArrowClick={() => routerActions.push(`/login?product=${product}`)}
          />
        )}
        <FormBody>
          <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.recovery_options.title'
              defaultMessage='Recovery Options'
            />
          </Text>
          <RecoveryOptionRow hasCloudBackup={hasCloudBackup} onClick={cloudRecoveryClicked}>
            <CircleBackground color={hasCloudBackup ? 'blue000' : 'grey000'}>
              <Icon name='cloud' color={hasCloudBackup ? 'blue600' : 'grey200'} size='16px' />
            </CircleBackground>
            <TextStack>
              <Text color={optionDisabledColor} size='14px' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.cloud_backup.title'
                  defaultMessage='Recover Account with Cloud Backup'
                />
              </Text>
              <Text color={optionDisabledColor} size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.cloud_backup'
                  defaultMessage='Restore your account using your phone and the cloud.'
                />
              </Text>
            </TextStack>
            <Icon name='chevron-right' size='20px' color='grey400' />
          </RecoveryOptionRow>
          <IconTextRow onClick={recoveryPhraseClicked}>
            <CircleBackground color='blue000'>
              <Icon name='key' color='blue600' size='12px' />
            </CircleBackground>
            <TextStack>
              <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.recovery_phrase.title'
                  defaultMessage='Use your recovery phrase'
                />
              </Text>
              <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.recovery_phrase'
                  defaultMessage='Recover your private key wallet + trading accounts.'
                />
              </Text>
            </TextStack>
            <Icon name='chevron-right' size='20px' color='grey400' />
          </IconTextRow>
          <IconTextRow onClick={resetAccountClicked}>
            <CircleBackground color='blue000'>
              <Icon name='refresh' color='blue600' size='28px' />
            </CircleBackground>
            <TextStack>
              <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.standard_recovery.title'
                  defaultMessage='Standard account recovery'
                />
              </Text>
              <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.recovery_options.standard_recovery'
                  defaultMessage='Recover your trading accounts.'
                />
              </Text>
            </TextStack>
            <Icon name='chevron-right' size='20px' color='grey400' />
          </IconTextRow>
        </FormBody>
      </WrapperWithPadding>
    </OuterWrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(RecoveryOptions)
