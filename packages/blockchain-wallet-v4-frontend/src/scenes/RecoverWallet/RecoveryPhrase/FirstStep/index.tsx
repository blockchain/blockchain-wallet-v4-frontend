import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { RecoverSteps } from 'data/types'
import { required, validMnemonic } from 'services/forms'

import { Props } from '../..'
import { BackArrowFormHeader, GoBackArrow, placeholder } from '../../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const WordContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 412px;
  margin: 16px 0;
  align-items: space-between;
`
const BottomRow = styled.div<{ cachedEmail: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.cachedEmail ? 'center' : 'flex-start')};
  align-items: center;
  margin-top: 24px;
`
const WordColumn = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 200px;
  > div {
    margin-bottom: 8px;
  }
`

const FirstStep = (props: Props) => {
  const {
    cachedEmail,
    cachedGuid,
    formActions,
    formValues,
    invalid,
    lastGuid,
    nabuId,
    setStep,
    submitting
  } = props
  return (
    <>
      {cachedEmail && (
        <BackArrowFormHeader
          handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
          email={cachedEmail}
          guid={cachedGuid || lastGuid}
        />
      )}
      <FormBody>
        <Text
          color='grey900'
          size='16px'
          weight={600}
          lineHeight='1.5'
          style={{ marginBottom: '8px' }}
        >
          <FormattedMessage
            id='scenes.recovery.title'
            defaultMessage='Input your secret private key recovery phrase'
          />
        </Text>
        <Text
          color='grey600'
          size='12px'
          weight={500}
          lineHeight='1.5'
          style={{ marginBottom: '16px' }}
        >
          <FormattedMessage
            id='scenes.reovery.subtitle'
            defaultMessage='Your 12 word Secret Private Key Recovery Phrase grants access to your account. Please input it in the order specified.'
          />
        </Text>
        <Field
          bgColor='grey000'
          autoComplete='off'
          autoFocus
          component={TextBox}
          disableSpellcheck
          name='mnemonic'
          validate={[required, validMnemonic]}
          height='96px'
          placeholder={
            <FormattedMessage
              id='scenes.recover.firststep.placeholder'
              defaultMessage='Enter your secret private key recovery phrase'
            />
          }
        />
      </FormBody>
      <Text
        size='14px'
        weight={500}
        color='grey600'
        lineHeight='1.5'
        style={{ margin: '8px 0 24px', textAlign: 'center' }}
      >
        <FormattedMessage
          id='scenes.recover.firststep.space'
          defaultMessage='Separate each word with a space'
        />
      </Text>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        height='48px'
        disabled={submitting || invalid}
        data-e2e='loginButton'
        style={{ marginBottom: '16px' }}
      >
        {submitting ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : (
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        )}
      </Button>
      <BottomRow cachedEmail={cachedEmail}>
        {!cachedEmail && (
          <GoBackArrow
            handleBackArrowClick={() => props.setStep(RecoverSteps.RECOVERY_OPTIONS)}
            minWidth='120px'
          />
        )}
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
            onClick={() => formActions.change('recover', 'step', RecoverSteps.RESET_ACCOUNT)}
            style={{ marginLeft: '4px' }}
          >
            <FormattedMessage
              id='scenes.login.reset_your_account'
              defaultMessage='Reset your account'
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
      </BottomRow>
    </>
  )
}

export default FirstStep
