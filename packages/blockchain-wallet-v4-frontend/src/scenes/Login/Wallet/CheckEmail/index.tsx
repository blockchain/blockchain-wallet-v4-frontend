import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import e from 'express'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { LoginSteps } from 'data/types'
import { VERIFY_EMAIL_SENT_ERROR } from 'services/alerts'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import SignupLink from '../../components/SignupLink'
import { CircleBackground, Row, WrapperWithPadding } from '../../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LoginWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  padding: 32px 0 24px;
  ${media.mobile`
  padding: 16px 0;
`}
`

const ButtonTextRow = styled(Row)`
  align-items: center;
`

const CheckEmail = (props: Props) => {
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

  const hasErrorAlert = props.alerts.find((alert) => alert.message === VERIFY_EMAIL_SENT_ERROR)

  return (
    <LoginWrapper>
      <WrapperWithPadding>
        <BackArrowHeader
          {...props}
          handleBackArrowClick={props.handleBackArrowClickWallet}
          product={props.productAuthMetadata.product}
        />
        <FormBody>
          <CircleBackground color='blue600'>
            <Icon name='computer' color='white' size='24px' />
          </CircleBackground>
          <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='copy.verifyyourdevice' defaultMessage='Verify Your Device' />
          </Text>
          <Text
            color='grey900'
            size='16px'
            weight={500}
            lineHeight='1.5'
            style={{ margin: '8px 0 24px 0', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.login.checkemail'
              defaultMessage='If you have an account registered with this email address, you will receive an email with a link to verify your device.'
            />
          </Text>
        </FormBody>
        <Button
          type='submit'
          nature='empty-blue'
          fullwidth
          height='48px'
          data-e2e='loginResendEmail'
          disabled={disabled && !hasErrorAlert}
          // @ts-ignore
          onClick={(e: SyntheticEvent) => {
            setDisabled(true)
            setSentState('sent')
            props.handleSubmit(e)
          }}
        >
          {disabled && sentState === 'sent' && !hasErrorAlert && (
            <ButtonTextRow>
              <Icon
                color='blue600'
                name='checkmark-circle-filled'
                size='14px'
                style={{ marginRight: '8px' }}
              />
              <FormattedMessage
                id='components.form.tabmenutransactionstatus.sent'
                defaultMessage='Sent'
              />
            </ButtonTextRow>
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
      </WrapperWithPadding>
      <SignupLink />
    </LoginWrapper>
  )
}

type Props = OwnProps & {
  handleSubmit: (e) => void
  setStep: (step: LoginSteps) => void
}

export default CheckEmail
