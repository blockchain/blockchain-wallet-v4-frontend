import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Field, InjectedFormProps } from 'redux-form'

import {
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox
} from 'components/Form'
import { selectors } from 'data'
import { required } from 'services/forms'

import { LoginSteps, Props as OwnProps } from '..'
import { BackArrowFormHeader, FooterButtons } from '../model'

const EnterPassword = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    authType,
    busy,
    formValues,
    invalid,
    loginError,
    setStep,
    submitting
  } = props

  const passwordError =
    loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  return (
    <>
      <BackArrowFormHeader formValues={formValues} setStep={setStep} />
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password'
            />
          </FormLabel>
          <Field
            name='password'
            validate={[required]}
            component={PasswordBox}
            data-e2e='loginPassword'
            placeholder='Enter your password'
          />
          {passwordError && (
            <FormError
              position={authType > 0 ? 'relative' : 'absolute'}
              data-e2e='passwordError'
            >
              <FormattedMessage
                id='scenes.login.wrong_password'
                defaultMessage='Error decrypting wallet. Wrong password'
              />
            </FormError>
          )}
          {accountLocked && (
            <FormError
              position={authType > 0 || passwordError ? 'relative' : 'absolute'}
            >
              {loginError}
            </FormError>
          )}
        </FormItem>
      </FormGroup>
      <FooterButtons submitting={submitting} invalid={invalid} busy={busy} />
    </>
  )
}

const mapStateToProps = state => ({
  authType: selectors.auth.getAuthType(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(EnterPassword)
