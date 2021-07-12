import React from 'react'
import { FormattedMessage } from 'react-intl'
import { has } from 'ramda'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormGroup, FormLabel, PasswordBox, TextBox } from 'components/Form'
import Terms from 'components/Terms'
import { LoginSteps, RecoverSteps } from 'data/types'
import { required, validPasswordConfirmation, validStrongPassword } from 'services/forms'

import { ActionButton, BackArrowFormHeader } from '../../model'
import { Props } from '..'

const Footer = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

export const RectangleBackground = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
  padding: 16px;
`

const validatePasswordConfirmation = validPasswordConfirmation('password')

const SecondStep = (props: Props) => {
  const {
    authActions,
    cacheActions,
    cachedEmail,
    cachedGuid,
    formActions,
    formValues,
    resetPassword,
    setStep
  } = props

  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => setStep(RecoverSteps.RECOVERY_OPTIONS)}
        email={cachedEmail}
        guid={cachedGuid}
        step={RecoverSteps.RESET_ACCOUNT}
      />
      <FormGroup>
        <FormLabel htmlFor='password'>
          <FormattedMessage
            id='scenes.securitysettings.advanced.walletpassword.settings.new'
            defaultMessage='New Password'
          />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='resetPassword'
          validate={[required, validStrongPassword]}
          component={PasswordBox}
          showPasswordScore
          passwordScore={has('zxcvbn', window) ? window.zxcvbn(resetPassword).score : 0}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor='confirmationPassword'>
          <FormattedMessage
            id='scenes.recover.secondstep.confirmapassword'
            defaultMessage='Confirm Password'
          />
        </FormLabel>
        <Field
          bgColor='grey000'
          name='confirmationPassword'
          validate={[required, validatePasswordConfirmation]}
          component={PasswordBox}
        />
      </FormGroup>
      <FormGroup>
        <Terms recovery />
      </FormGroup>
      <RectangleBackground>
        <Text size='12px' weight={500} lineHeight='1.5' color='grey900'>
          <FormattedMessage
            id='scenes.recovery.reverify'
            defaultMessage='For your security, you may have to re-verify your identity before accessing your trading or interest account. <a>Learn more</a>'
            values={{
              a: (msg) => (
                <a
                  href='https://support.blockchain.com/hc/en-us'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {msg}
                </a>
              )
            }}
          />
        </Text>
      </RectangleBackground>
      <Footer>
        <ActionButton
          data-e2e='recoverSubmit'
          // disabled={isRegistering || invalid}
          nature='primary'
          type='submit'
          fullwidth
        >
          {/* {isRegistering ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : ( */}
          <FormattedMessage id='scenes.recover.secondstep.recover' defaultMessage='Recover Funds' />
          {/* )} */}
        </ActionButton>
      </Footer>
    </>
  )
}

export default SecondStep
