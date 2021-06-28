import React from 'react'
import { FormattedMessage } from 'react-intl'
import { range } from 'ramda'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { LoginSteps } from 'data/types'
import { requiredNoErrorText, validMnemonic } from 'services/forms'

import { Props as OwnProps } from '..'
import { ActionButton, BackArrowFormHeader, Column } from '../model'

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
const BottomRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`
const WordColumn = styled(Column)`
  max-width: 200px;
  > div {
    margin-bottom: 8px;
  }
`
const RecoveryPhrase = (props: Props) => {
  const {
    authActions,
    busy,
    cacheActions,
    formActions,
    formValues,
    invalid,
    setStep,
    submitting
  } = props
  const phraseRange = range(1, 13)
  const columnOneNumbers = range(1, 7)
  const columnTwoNumbers = range(7, 13)
  const phraseArray = phraseRange.map((number) => formValues[number])
  const phrase = phraseArray.join(' ')
  const fieldsTouchedArray = phraseRange.map((number) => props.formMeta[number]?.touched)
  const allFieldsTouched = fieldsTouchedArray.every((field) => field === true)
  const validPhrase = validMnemonic(phrase) === undefined

  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setStep(LoginSteps.ENTER_EMAIL_GUID)}
        formValues={formValues}
      />
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
                name={`${number}`}
                key={`recoveryWord_${number}`}
                datae2e={`recoveryInput_${number}`}
                noLastPass
                placeholder={number}
                validate={[requiredNoErrorText]}
                autoComplete='off'
                disableSpellcheck
              />
            ))}
          </WordColumn>
          <WordColumn>
            {columnTwoNumbers.map((number) => (
              <Field
                component={TextBox}
                name={`${number}`}
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
      <ActionButton
        type='submit'
        nature='primary'
        fullwidth
        height='48px'
        disabled={submitting || invalid || busy || !validPhrase}
        data-e2e='loginButton'
        style={{ marginBottom: '16px' }}
      >
        {submitting ? (
          <HeartbeatLoader height='20px' width='20px' color='white' />
        ) : (
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='scenes.login.recover_account' defaultMessage='Recover account' />
          </Text>
        )}
      </ActionButton>
      <BottomRow>
        <Text size='13px' weight={600} color='grey600'>
          <FormattedMessage
            id='scenes.login.trouble_logging_in'
            defaultMessage='Trouble logging in?'
          />
        </Text>
        <Text
          size='13px'
          weight={600}
          color='blue600'
          data-e2e='troubleLoggingIn'
          cursor='pointer'
          onClick={() => formActions.change('login', 'step', LoginSteps.RECOVERY_OPTIONS)}
          style={{ marginLeft: '4px' }}
        >
          <FormattedMessage id='scenes.login.recover_account' defaultMessage='Recover account' />
        </Text>
      </BottomRow>
    </>
  )
}

type Props = OwnProps & {
  setStep: (step: LoginSteps) => void
}

export default RecoveryPhrase
