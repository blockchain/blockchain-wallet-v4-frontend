import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { RecoverSteps } from 'data/types'

import { Props } from '..'
import { BackArrowFormHeader, CircleBackground, GoBackArrow } from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`
const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const TextStack = styled.div`
  max-width: 312px;
`
const RecoveryOptions = (props: Props) => {
  const {
    authActions,
    cachedGuid,
    emailFromMagicLink,
    formActions,
    lastGuid,
    nabuId,
    routerActions
  } = props
  const cloudRecoveryClicked = () => {
    formActions.change('recover', 'step', RecoverSteps.CLOUD_RECOVERY)
    authActions.recoveryOptionSelected('CLOUD_BACKUP')
  }
  const recoveryPhraseClicked = () => {
    formActions.change('recover', 'step', RecoverSteps.RECOVERY_PHRASE)
    authActions.recoveryOptionSelected('RECOVERY_PHRASE')
  }

  const resetAccountClicked = () => {
    formActions.change('recover', 'step', RecoverSteps.RESET_ACCOUNT)
    authActions.resetAccountClicked('RECOVERY_OPTIONS')
  }
  return (
    <Wrapper>
      {emailFromMagicLink && (
        <BackArrowFormHeader
          handleBackArrowClick={() => routerActions.push('/login')}
          email={emailFromMagicLink}
          guid={cachedGuid || lastGuid}
        />
      )}
      {!emailFromMagicLink && (
        <GoBackArrow handleBackArrowClick={() => routerActions.push('/login')} />
      )}
      <FormBody>
        <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage
            id='scenes.login.recovery_options.title'
            defaultMessage='Recovery Options'
          />
        </Text>
        <IconTextRow onClick={cloudRecoveryClicked}>
          <CircleBackground color='blue000'>
            <Icon name='cloud' color='blue600' size='16px' />
          </CircleBackground>
          <TextStack>
            <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.cloud_backup.title'
                defaultMessage='Recover Account with Cloud Backup'
              />
            </Text>
            <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.cloud_backup'
                defaultMessage='Restore your account using your phone and the cloud.'
              />
            </Text>
          </TextStack>
          <Icon name='chevron-right' size='20px' color='grey400' />
        </IconTextRow>
        <IconTextRow onClick={recoveryPhraseClicked}>
          <CircleBackground color='blue000'>
            <Icon name='keyboard' color='blue600' size='22px' />
          </CircleBackground>
          <TextStack>
            <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.phrase.title'
                defaultMessage='Recover Account with Recovery Phrase'
              />
            </Text>
            <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.phrase'
                defaultMessage='Restore your account with your 12-word Secret Private key Recovery Phrase.'
              />
            </Text>
          </TextStack>
          <Icon name='chevron-right' size='20px' color='grey400' />
        </IconTextRow>
      </FormBody>
      <Row>
        <Text size='13px' weight={600} color='grey600'>
          <FormattedMessage
            id='scenes.login.trouble_logging_in'
            defaultMessage='Trouble Logging In?'
          />
        </Text>
        {nabuId ? (
          <Text
            size='13px'
            weight={600}
            color='blue600'
            data-e2e='troubleLoggingIn'
            cursor='pointer'
            onClick={resetAccountClicked}
            style={{ marginLeft: '4px' }}
          >
            <FormattedMessage
              id='scenes.login.reset_your_account.arrow'
              defaultMessage='Reset your account ->'
            />
          </Text>
        ) : (
          <Link
            weight={600}
            size='13px'
            target='_blank'
            href='https://support.blockchain.com/'
            style={{ marginLeft: '2px' }}
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </Link>
        )}
      </Row>
    </Wrapper>
  )
}

export default RecoveryOptions
