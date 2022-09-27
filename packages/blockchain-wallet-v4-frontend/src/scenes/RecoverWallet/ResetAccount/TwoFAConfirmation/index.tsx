import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import TextBox from 'components/Form/TextBox'
import { selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RecoverSteps } from 'data/types'
import { useRemote } from 'hooks'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { isMobile, media } from 'services/styles'

import { Props } from '../..'
import { ActionButton, BackArrowFormHeader, CenteredColumn, FormWrapper, Row } from '../../model'

const ResponsiveRow = styled(Row)`
  justify-content: center;
  margin-top: 16px;
  ${media.mobile`
    flex-direction: column;
    align-items: center;
    line-height: 2;
  `}
`

const TwoFAConfirmation = (props: Props) => {
  const { hasError } = useRemote(selectors.signup.getRecoveryTwoFAVerification)
  const { accountRecoveryData, busy, formValues, invalid, setStep, signupActions, submitting } =
    props
  const authType = accountRecoveryData && accountRecoveryData?.two_fa_type
  const placeholder = authType === 5 ? '_ _ _  _ _ _' : authType === 4 ? '_ _ _ _ _' : null

  const handleSubmit = (e) => {
    e.preventDefault()
    signupActions.verifyTwoFaForRecovery({
      code: formValues?.twoFACode,
      email: formValues.recoveryEmail
    })
  }

  //   const accountLocked =
  // '    walletError &&
  //     (walletError.toLowerCase().includes('this account has been locked') ||
  //       walletError.toLowerCase().includes('account is locked') ||
  //       walletError.toLowerCase().includes('account deactivated'))'

  //   const twoFactorError = walletError && walletError.toLowerCase().includes('authentication code')
  //   const handleSmsResend = () => {
  //     const email =
  //       product === ProductAuthOptions.EXCHANGE ? formValues?.exchangeEmail : formValues.email
  //     authActions.resendSmsCode({ email, guid: formValues?.guid })
  // }

  return (
    <Form onSubmit={handleSubmit}>
      <FormWrapper>
        <BackArrowFormHeader
          handleBackArrowClick={() => setStep(RecoverSteps.RESET_WARNING)}
          email={accountRecoveryData?.email}
        />

        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              {authType === 1 && (
                <FormattedMessage
                  id='scenes.login.yubikey_verify'
                  defaultMessage='Verify with your Yubikey'
                />
              )}
              {(authType === 4 || authType === 5) &&
                (isMobile() ? (
                  <FormattedMessage
                    id='scenes.logins.twofa.enter_code.mobile_width'
                    defaultMessage='Two Factor Authentication Code'
                  />
                ) : (
                  <FormattedMessage
                    id='scenes.logins.twofa.enter_code_field'
                    defaultMessage='2 Factor Authentication Code'
                  />
                ))}
            </FormLabel>
            <Field
              name='twoFACode'
              normalize={removeWhitespace}
              validate={[required]}
              component={authType === 1 ? PasswordBox : TextBox}
              placeholder={placeholder}
              noLastPass
              autoFocus
              data-e2e='loginTwoFactorCode'
            />
            {hasError && (
              <FormError data-e2e='twoFAConfirmationError' style={{ paddingTop: '4px' }}>
                <FormattedMessage
                  id='scenes.recovery.invalid_twofa'
                  defaultMessage='Incorrect code'
                />
              </FormError>
            )}

            {/* figure out what errors will be for these codes
          {authType === 5 && (
              <Link size='12px' weight={400} onClick={handleSmsResend}>
                <FormattedMessage id='scenes.login.resendsms' defaultMessage='Resend SMS' />
              </Link>
            )}
            {twoFactorError && <FormError position='absolute'>{walletError}</FormError>}
            {accountLocked && (
              <FormError position='absolute'>{walletError?.split('.')[0]}.</FormError>
            )} */}
          </FormItem>
        </FormGroup>

        <ActionButton
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !formValues?.twoFACode}
          data-e2e='confirmTwoFA'
          style={{ marginBottom: '16px' }}
        >
          {submitting || busy ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage id='modals.confirm.title' defaultMessage='Confirm' />
            </Text>
          )}
        </ActionButton>
        <ResponsiveRow>
          <Text
            color='blue600'
            size='14px'
            weight={500}
            lineHeight='1.5'
            style={{ cursor: 'pointer' }}
            onClick={() =>
              props.modalActions.showModal(ModalName.SKIP_TWOFA_CONFIRMATION_WARNING, {
                origin: 'ResetAccount'
              })
            }
          >
            <FormattedMessage id='scenes.reset.without_2fa' defaultMessage='Continue without 2FA' />
          </Text>
        </ResponsiveRow>
      </FormWrapper>
    </Form>
  )
}

export default TwoFAConfirmation
