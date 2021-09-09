import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { Button, Icon, Text } from 'blockchain-info-components'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { LoginFormType, LoginSteps } from 'data/types'
import { isGuid } from 'services/forms'

// step templates
import Loading from '../loading.public'
import CheckEmail from './CheckEmail'
import EnterEmailOrGuid from './EnterEmailOrGuid'
import EnterPassword from './EnterPassword'
import { CreateAccount, LOGIN_FORM_NAME, PhishingWarning } from './model'
import VerificationMobile from './VerificationMobile'

class Login extends PureComponent<InjectedFormProps<{}, Props> & Props, StateProps> {
  constructor(props) {
    super(props)
    this.state = {
      captchaToken: undefined
    }
  }

  componentDidMount() {
    this.props.authActions.initializeLogin()
    this.initCaptcha()
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(LOGIN_FORM_NAME, 'step', step)
  }

  initCaptcha = (callback?) => {
    /* eslint-disable */
    // @ts-ignore
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    // @ts-ignore
    window.grecaptcha.enterprise.ready(() => {
      // @ts-ignore
      window.grecaptcha.enterprise
        .execute(window.CAPTCHA_KEY, {
          action: 'LOGIN'
        })
        .then((captchaToken) => {
          console.log('Captcha success')
          this.setState({ captchaToken })
          callback && callback(captchaToken)
        })
        .catch((e) => {
          console.error('Captcha error: ', e)
        })
    })
    /* eslint-enable */
  }

  // Every step is part of one form
  // One submit function that fires different events
  // Depending on which step user is on
  handleSubmit = (e) => {
    e.preventDefault()
    // sometimes captcha doesnt mount correctly (race condition?)
    // if it's undefined, try to re-init for token
    if (!this.state.captchaToken) {
      return this.initCaptcha(this.continueLoginProcess)
    }
    // we have a captcha token, continue login process
    this.continueLoginProcess()
  }

  handleSmsResend = () => {
    this.props.authActions.resendSmsCode({
      email: this.props.formValues?.email,
      guid: this.props.guid
    })
  }

  continueLoginProcess = () => {
    const { authActions, code, formActions, formValues, guid, guidOrEmail, password } = this.props
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
        formActions.change(LOGIN_FORM_NAME, 'step', LoginSteps.VERIFICATION_MOBILE)
      } else {
        formActions.change(LOGIN_FORM_NAME, 'email', guidOrEmail)
        authActions.triggerWalletMagicLink({
          captchaToken: this.state.captchaToken,
          email: guidOrEmail
        })
        this.initCaptcha()
      }
      const idType = isGuid(guidOrEmail) ? 'WALLET_ID' : 'EMAIL'
      authActions.loginIdEntered(idType)
    } else {
      authActions.login({ code: auth, guid, mobileLogin: null, password, sharedKey: null })
    }
  }

  loginWithMobileClicked = () => {
    this.props.authActions.loginMethodSelected('SECURE_CHANNEL')
    this.setStep(LoginSteps.VERIFICATION_MOBILE)
  }

  render() {
    const { data, formValues, ssoDummy } = this.props
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
        {ssoDummy && (
          <Button
            onClick={() => {
              window.parent.postMessage(
                `msg from wallet. Date: ${new Date().getMilliseconds()}`,
                '*'
              )
            }}
            nature='primary'
            data-e2e=''
          >
            {' '}
            Send Message to Mobile{' '}
          </Button>
        )}
        <Text color='white' size='24px' weight={600} style={{ marginBottom: '24px' }}>
          {step === LoginSteps.ENTER_PASSWORD ? (
            <FormattedMessage id='scenes.login.authorize' defaultMessage='Authorize login' />
          ) : (
            <FormattedMessage id='scenes.login.welcome' defaultMessage='Welcome back!' />
          )}
        </Text>
        {step === LoginSteps.VERIFICATION_MOBILE && (
          <Text color='grey400' weight={500} style={{ marginBottom: '32px' }}>
            <FormattedMessage id='scenes.login.approve' defaultMessage='Approve your login' />
          </Text>
        )}

        {step === LoginSteps.ENTER_PASSWORD && (
          <Text color='grey400' weight={500} style={{ marginBottom: '32px' }}>
            <FormattedMessage
              id='scenes.login.enter_password_login'
              defaultMessage='Enter your password to login'
            />
          </Text>
        )}

        {step === LoginSteps.ENTER_EMAIL_GUID && (
          <Text color='grey400' weight={500} style={{ marginBottom: '32px' }}>
            <FormattedMessage
              id='scenes.login.enter_email_header'
              defaultMessage='Enter Your Email Address or Wallet ID'
            />
          </Text>
        )}
        <Wrapper>
          <Form onSubmit={this.handleSubmit}>
            {(() => {
              switch (step) {
                case LoginSteps.ENTER_EMAIL_GUID:
                  return (
                    <EnterEmailOrGuid
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                    />
                  )
                case LoginSteps.ENTER_PASSWORD:
                  return (
                    <EnterPassword
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                    />
                  )

                case LoginSteps.CHECK_EMAIL:
                  return (
                    <CheckEmail
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                    />
                  )

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
        {step === LoginSteps.ENTER_PASSWORD && (
          <Text
            color='white'
            weight={600}
            size='16px'
            cursor='pointer'
            style={{ marginTop: '24px' }}
            onClick={this.loginWithMobileClicked}
          >
            <FormattedMessage
              id='scenes.login.loginwithmobile'
              defaultMessage='Log In with Mobile App ->'
            />
          </Text>
        )}
        {step === LoginSteps.ENTER_EMAIL_GUID && (
          <>
            <CreateAccount />
            <Text size='14px' color='grey400' weight={500} style={{ marginBottom: '16px' }}>
              <FormattedMessage
                id='scenes.login.phishingwarning'
                defaultMessage='Please check that you are visiting the correct URL'
              />
            </Text>
            <PhishingWarning>
              <Icon name='padlock' color='grey400' size='14px' />
              <Text color='grey400' weight={500} style={{ paddingLeft: '8px' }}>
                https://login.blockchain.com
              </Text>
            </PhishingWarning>
          </>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  authType: selectors.auth.getAuthType(state) as Number,
  code: formValueSelector(LOGIN_FORM_NAME)(state, 'code'),
  data: selectors.auth.getLogin(state) as RemoteDataType<any, any>,
  formMeta: getFormMeta(LOGIN_FORM_NAME)(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM_NAME)(state) as LoginFormType,
  guid: formValueSelector(LOGIN_FORM_NAME)(state, 'guid'),
  guidOrEmail: formValueSelector(LOGIN_FORM_NAME)(state, 'guidOrEmail'),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  password: formValueSelector(LOGIN_FORM_NAME)(state, 'password'),
  ssoDummy: selectors.core.walletOptions.getSsoDummy(state)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type FormProps = {
  busy: boolean
  initCaptcha: () => void
  invalid: boolean
  loginError?: string
  pristine: boolean
  setStep: (step: LoginSteps) => void
  submitting: boolean
}

type StateProps = {
  captchaToken?: string
}
export type Props = ConnectedProps<typeof connector> & FormProps

const enhance = compose<any>(
  reduxForm({
    form: LOGIN_FORM_NAME
  }),
  connector
)

export default enhance(Login)
