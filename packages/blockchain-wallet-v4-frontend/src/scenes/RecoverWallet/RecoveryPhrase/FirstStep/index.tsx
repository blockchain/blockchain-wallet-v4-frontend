import React from 'react'
import { FormattedMessage } from 'react-intl'
import { range } from 'ramda'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { RecoverSteps } from 'data/types'
import { requiredNoErrorText, validMnemonic } from 'services/forms'

import { Props } from '../..'
import { BackArrowFormHeader, GoBackArrow } from '../../model'

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
    nabuId,
    setStep,
    submitting
  } = props
  const phraseRange = range(1, 13)
  const columnOneNumbers = range(1, 7)
  const columnTwoNumbers = range(7, 13)
  const phraseArray = phraseRange.map((number) => formValues?.[`recoveryWord_${number}`])
  const phrase = phraseArray.join(' ')
  const fieldsTouchedArray = phraseRange.map(
    (number) => props.formMeta[`recoveryWord_${number}`]?.touched
  )
  const allFieldsTouched = fieldsTouchedArray.every((field) => field === true)
  const validPhrase = validMnemonic(phrase) === undefined

  const removeWhitespace = (string) => string.replace(/\s/g, ``)

  return (
    <>
      {cachedEmail && (
        <BackArrowFormHeader
          handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
          email={cachedEmail}
          guid={cachedGuid}
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
        <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
          <FormattedMessage
            id='scenes.reovery.subtitle'
            defaultMessage='Your 12 word Secret Private Key Recovery Phrase grants access to your account. Please input it in the order specified.'
          />
        </Text>
        <WordContainer>
          <WordColumn>
            {columnOneNumbers.map((number) => (
              <Field
                component={TextBox}
                name={`recoveryWord_${number}`}
                key={`recoveryWord_${number}`}
                datae2e={`recoveryInput_${number}`}
                noLastPass
                placeholder={number}
                validate={[requiredNoErrorText]}
                autoComplete='off'
                disableSpellcheck
                normalize={removeWhitespace}
              />
            ))}
          </WordColumn>
          <WordColumn>
            {columnTwoNumbers.map((number) => (
              <Field
                component={TextBox}
                name={`recoveryWord_${number}`}
                key={`recoveryWord_${number}`}
                datae2e={`recoveryInput_${number}`}
                noLastPass
                placeholder={number}
                validate={[requiredNoErrorText]}
                autoComplete='off'
                disableSpellcheck
                errorBottom
              />
            ))}
          </WordColumn>
        </WordContainer>
      </FormBody>
      <Text color='red600' size='14px' weight={500}>
        {allFieldsTouched && !validPhrase && (
          <FormattedMessage id='scenes.recover.invalid_phrase' defaultMessage='Invalid Phrase' />
        )}
      </Text>
      <Button
        type='submit'
        nature='primary'
        fullwidth
        height='48px'
        disabled={submitting || invalid || !validPhrase}
        data-e2e='loginButton'
        style={{ marginBottom: '16px' }}
        onClick={() => formActions.change('recover', 'mnemonic', phrase)}
      >
        {submitting ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : (
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        )}
      </Button>
      <BottomRow cachedEmail>
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
