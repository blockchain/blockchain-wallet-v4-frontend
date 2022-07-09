import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions, RecoverSteps } from 'data/types'
import { required } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { isMobile, media } from 'services/styles'

import { Props as OwnProps } from '../..'
import { ActionButton, BackArrowFormHeader, ResetFormSteps, Row } from '../../model'

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
  const { accountRecoveryData, busy, formValues, invalid, setFormStep, submitting } = props
  const authType = accountRecoveryData && accountRecoveryData?.two_fa_type

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
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => setFormStep(ResetFormSteps.RESET_WARNING)}
        email={accountRecoveryData?.email}
      />

      <FormGroup>
        <FormItem>
          Placeholder 2FA title
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
                  id='scenes.logins.twofa.enter_code'
                  defaultMessage='Enter your Two Factor Authentication Code'
                />
              ))}
          </FormLabel>
          <Field
            name='twoFACode'
            normalize={removeWhitespace}
            validate={[required]}
            component={authType === 1 ? PasswordBox : TextBox}
            noLastPass
            autoFocus
            data-e2e='loginTwoFactorCode'
          />
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
    </>
  )
}

type Props = {
  setFormStep: (step) => void
} & OwnProps

export default TwoFAConfirmation
