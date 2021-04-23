import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, InjectedFormProps } from 'redux-form'

import { Link } from 'blockchain-info-components'
import {
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox,
  TextBox
} from 'components/Form'
import { actions, selectors } from 'data'
import { required } from 'services/forms'

import { LoginSteps, Props as OwnProps } from '..'
import { BackArrowFormHeader, FooterButtons, removeWhitespace } from '../model'

const EnterTwoFactor = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    authType,
    busy,
    formValues,
    guid,
    invalid,
    loginError,
    setStep,
    submitting
  } = props
  const twoFactorError =
    loginError && loginError.toLowerCase().includes('authentication code')

  const handleSmsResend = () => {
    props.authActions.resendSmsCode(guid)
  }
  return (
    <>
      <BackArrowFormHeader formValues={formValues} setStep={setStep} />
      {authType > 0 && (
        <FormGroup>
          <FormItem>
            <FormLabel htmlFor='code'>
              {authType === 1 && (
                <FormattedMessage
                  id='scenes.login.yubikey_verify'
                  defaultMessage='Verify with your Yubikey'
                />
              )}
              {authType === 4 ||
                (authType === 5 && (
                  <FormattedMessage
                    id='scenes.logins.twofa.enter_code'
                    defaultMessage='Enter your Two Factor Authentication Code'
                  />
                ))}
            </FormLabel>
            <Field
              name='code'
              normalize={removeWhitespace}
              validate={[required]}
              component={authType === 5 ? PasswordBox : TextBox}
              noLastPass
              autoFocus
              data-e2e='loginTwoFactorCode'
            />
            {authType === 5 && (
              <Link size='12px' weight={400} onClick={handleSmsResend}>
                <FormattedMessage
                  id='scenes.login.resendsms'
                  defaultMessage='Resend SMS'
                />
              </Link>
            )}
            {twoFactorError && (
              <FormError position={'absolute'}>{loginError}</FormError>
            )}
          </FormItem>
        </FormGroup>
      )}
      <FooterButtons submitting={submitting} invalid={invalid} busy={busy} />
    </>
  )
}

const mapStateToProps = state => ({
  authType: selectors.auth.getAuthType(state)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(EnterTwoFactor)
