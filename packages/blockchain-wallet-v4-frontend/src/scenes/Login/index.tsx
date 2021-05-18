import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { Link, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { LoginFormType, LoginSteps } from 'data/types'
import { isGuid } from 'services/forms'

import Loading from '../loading.public'
import CheckEmail from './CheckEmail'
// step templates
import EnterEmailOrGuid from './EnterEmailOrGuid'
import EnterPassword from './EnterPassword'
import { LOGIN_FORM_NAME, SignUpText, SubCard } from './model'
import VerificationMobile from './VerificationMobile'

class Login extends PureComponent<InjectedFormProps & Props> {
  componentDidMount() {
    this.props.authNewActions.initializeLogin()
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(LOGIN_FORM_NAME, 'step', step)
  }

  // Every step is part of one form
  // One submit function that fires different events
  // Depending on which step user is on
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      authActions,
      authNewActions,
      code,
      formActions,
      formValues,
      guid,
      guidOrEmail,
      password
    } = this.props
    let auth = code
    // only uppercase if authType is not Yubikey
    if (auth && this.props.authType !== 1) {
      auth = auth.toUpperCase()
    }
    if (
      formValues.step === LoginSteps.ENTER_EMAIL_GUID ||
      formValues.step === LoginSteps.CHECK_EMAIL
    ) {
      if (isGuid(guidOrEmail)) {
        formActions.change(LOGIN_FORM_NAME, 'guid', guidOrEmail)
        authNewActions.guidWallet(guidOrEmail)
      } else {
        formActions.change(LOGIN_FORM_NAME, 'email', guidOrEmail)
        authNewActions.loginGuid(guidOrEmail)
      }
    } else {
      authActions.login(guid, password, auth)
    }
  }

  handleSmsResend = () => {
    this.props.authActions.resendSmsCode(this.props.guid)
  }

  render() {
    const { data, formValues } = this.props
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID
    const { busy, error } = data.cata({
      Failure: (val) => ({ busy: false, error: val.err }),
      Loading: () => <Loading />,
      NotAsked: () => ({ busy: false, error: null }),
      Success: () => ({ busy: false, error: null })
    })
    const loginProps = {
      busy,
      handleSmsResend: this.handleSmsResend,
      loginError: error
    }
    return (
      <>
        <Text color='white' size='24px' weight={600} style={{ marginBottom: '30px' }}>
          {step === LoginSteps.ENTER_PASSWORD ? (
            <FormattedMessage id='scenes.login.authorize' defaultMessage='Authorize login' />
          ) : (
            <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back!' />
          )}
        </Text>
        <Text color='grey400' weight={500} style={{ marginBottom: '24px' }}>
          {step === LoginSteps.VERIFICATION_MOBILE && (
            <FormattedMessage id='scenes.login.approve' defaultMessage='Approve your login' />
          )}
          {step === LoginSteps.ENTER_PASSWORD && (
            // add check here to see what kind of auth type, what kind of string to show
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password to login'
            />
          )}
        </Text>
        <Wrapper>
          <Form onSubmit={this.handleSubmit}>
            {(() => {
              switch (step) {
                case LoginSteps.ENTER_EMAIL_GUID:
                  return <EnterEmailOrGuid {...this.props} {...loginProps} setStep={this.setStep} />
                case LoginSteps.ENTER_PASSWORD:
                  return <EnterPassword {...this.props} {...loginProps} setStep={this.setStep} />

                case LoginSteps.CHECK_EMAIL:
                  return <CheckEmail {...this.props} {...loginProps} setStep={this.setStep} />

                case LoginSteps.VERIFICATION_MOBILE:
                  return (
                    <VerificationMobile {...this.props} {...loginProps} setStep={this.setStep} />
                  )
                default:
                  return null
              }
            })()}
          </Form>
        </Wrapper>
        {step === LoginSteps.ENTER_EMAIL_GUID && (
          <LinkContainer data-e2e='signupLink' to='/signup'>
            <Link>
              <SubCard>
                <Text size='16px' color='grey400' weight={500}>
                  <FormattedMessage
                    id='scenes.login.wallet.link_signup'
                    defaultMessage="Don't have a Blockchain Wallet?"
                  />
                </Text>
                &nbsp;
                <SignUpText size='16px' color='white' weight={600}>
                  <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
                </SignUpText>
              </SubCard>
            </Link>
          </LinkContainer>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authType: selectors.auth.getAuthType(state),
  code: formValueSelector(LOGIN_FORM_NAME)(state, 'code'),
  data: selectors.auth.getLogin(state),
  formMeta: getFormMeta(LOGIN_FORM_NAME)(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM_NAME)(state) as LoginFormType,
  // TODO guid selector shouldn't come from form
  // we set it on the state when we get the callback
  guid: formValueSelector(LOGIN_FORM_NAME)(state, 'guid'),
  guidOrEmail: formValueSelector(LOGIN_FORM_NAME)(state, 'guidOrEmail'),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  password: formValueSelector(LOGIN_FORM_NAME)(state, 'password')
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  authNewActions: bindActionCreators(actions.authNew, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type FormProps = {
  busy: boolean
  invalid: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
  submitting: boolean
}

export type Props = ConnectedProps<typeof connector> & FormProps

const enhance = compose<any>(
  reduxForm({
    form: LOGIN_FORM_NAME
  }),
  connector
)

export default enhance(Login)
