import React, { SyntheticEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, IconCheckCircle, IconComputer, PaletteColors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import { RecoverSteps } from 'data/types'
import { RECOVERY_EMAIL_SENT_ERROR } from 'services/alerts'

import { Props } from '..'
import { BackArrowFormHeader, CircleBackground, FormWrapper, Row } from '../model'

const CheckInbox = (props: Props) => {
  const [disabled, setDisabled] = useState(true)
  const [sentState, setSentState] = useState('sent')
  useEffect(() => {
    if (disabled) {
      setTimeout(() => {
        setDisabled(false)
      }, 30000)
    }
    if (sentState === 'sent') {
      setTimeout(() => {
        setSentState('checkEmail')
      }, 5000)
    }
  }, [disabled, sentState])

  const hasErrorAlert = props.alerts.find((alert) => alert.message === RECOVERY_EMAIL_SENT_ERROR)

  const handleSubmit = (e) => {
    e.preventDefault()
    setDisabled(true)
    setSentState('sent')
    props.signupActions.triggerRecoverEmail(props.formValues?.recoveryEmail)
  }

  return (
    <FormWrapper>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setStep(RecoverSteps.FORGOT_PASSWORD_EMAIL)}
        email={props.formValues.recoveryEmail}
      />
      <Flex flexDirection='column' alignItems='center'>
        <CircleBackground color='blue600'>
          <IconComputer color={PaletteColors['white-000']} size='medium' />
        </CircleBackground>
        <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage id='copy.check_your_inbox' defaultMessage='Check Your Inbox' />
        </Text>
        <Text
          color='grey900'
          size='16px'
          weight={500}
          lineHeight='1.5'
          style={{ margin: '8px 0 24px 0', textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.recovery.checkemail'
            defaultMessage='A link to recover your account has been sent to your inbox.'
          />
        </Text>
      </Flex>
      <Button
        type='submit'
        nature='empty-blue'
        fullwidth
        height='48px'
        data-e2e='loginResendEmail'
        disabled={disabled && !hasErrorAlert}
        // @ts-ignore
        onClick={(e: SyntheticEvent) => {
          handleSubmit(e)
        }}
      >
        {disabled && sentState === 'sent' && !hasErrorAlert && (
          <Row>
            <IconCheckCircle size='small' style={{ marginRight: '8px' }} />
            <FormattedMessage
              id='components.form.tabmenutransactionstatus.sent'
              defaultMessage='Sent'
            />
          </Row>
        )}
        {disabled && sentState === 'checkEmail' && !hasErrorAlert && (
          <FormattedMessage id='copy.check_your_email' defaultMessage='Check your email' />
        )}
        {!disabled && (
          <FormattedMessage
            id='components.EmailVerification.sendemailagain'
            defaultMessage='Send Again'
          />
        )}
      </Button>
    </FormWrapper>
  )
}

export default CheckInbox
