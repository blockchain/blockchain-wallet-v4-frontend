import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector, getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import {
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from 'data/types'
import { isGuid } from 'services/forms'

// step templates
import Loading from '../loading.public'
import MergeAccountConfirm from './AccountUnification/MergeAccountConfirm'
import ProductPicker from './AccountUnification/ProductPicker'
import UpgradePassword from './AccountUnification/UpgradePassword'
import UpgradeSuccess from './AccountUnification/UpgradeSuccess'
import ExchangeEnterEmail from './Exchange/EnterEmail'
import EnterPasswordExchange from './Exchange/EnterPasswordExchange'
import {
  getLoginPageFooter,
  getLoginPageSubTitle,
  getLoginPageTitle,
  LOGIN_FORM_NAME
} from './model'
import { getData } from './selectors'
import CheckEmail from './Wallet/CheckEmail'
import WalletEnterEmailOrGuid from './Wallet/EnterEmailOrGuid'
import EnterPasswordWallet from './Wallet/EnterPasswordWallet'
import VerificationMobile from './Wallet/VerificationMobile'

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
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise.execute(window.CAPTCHA_KEY, { action: 'LOGIN' })
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
    const {
      authActions,
      code,
      designatedProduct,
      exchangePassword,
      exchangeTwoFA,
      formActions,
      formValues,
      guid,
      guidOrEmail,
      language,
      password,
      upgradePassword
    } = this.props

    // only uppercase if authType is not Yubikey
    let auth = code
    if (auth && this.props.authType !== 1) {
      auth = auth.toUpperCase()
    }

    // if we're trying to trigger the verification link
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
          email: guidOrEmail,
          product: designatedProduct
        })
        this.initCaptcha()
      }
      const idType = isGuid(guidOrEmail) ? 'WALLET_ID' : 'EMAIL'
      authActions.analyticsLoginIdEntered(idType)
    } else if (formValues.step === LoginSteps.ENTER_PASSWORD_WALLET) {
      // if we're trying to submit password to authenticate
      authActions.login({ code: auth, guid, mobileLogin: null, password, sharedKey: null })
    } else if (formValues.step === LoginSteps.UPGRADE_PASSWORD) {
      authActions.register({
        country: undefined,
        email: formValues.email,
        language,
        password: upgradePassword,
        state: undefined
      })
      // TODO: add action here that merges the account or sets step to merge
    } else {
      // Authenticate to Exchange
      authActions.exchangeLogin({
        code: exchangeTwoFA,
        password: exchangePassword,
        username: formValues.email
      })
    }
  }

  loginWithMobileClicked = () => {
    this.props.authActions.analyticsLoginMethodSelected('SECURE_CHANNEL')
    this.setStep(LoginSteps.VERIFICATION_MOBILE)
  }

  render() {
    const { authPlatform, designatedProduct, exchangeLoginData, formValues } = this.props
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID

    // TODO: fix this to handle both wallet and exchange login in a data.cata
    const { busy, error } = exchangeLoginData.cata({
      Failure: (val) => ({ busy: false, error: val }),
      Loading: () => <Loading />,
      NotAsked: () => ({ busy: false, error: null }),
      Success: () => ({ busy: false, error: null })
    })
    const loginProps = {
      busy,
      exchangeError: error,
      handleSmsResend: this.handleSmsResend,
      loginError: undefined
    }

    const isMobileViewLogin =
      authPlatform === PlatformTypes.ANDROID || authPlatform === PlatformTypes.IOS

    return (
      <>
        {/* TITLE */}
        <Text color='white' size='24px' weight={600} style={{ marginBottom: '24px' }}>
          {getLoginPageTitle(step)}
        </Text>

        {/* SUBTITLE */}
        <Text color='grey400' weight={500} style={{ marginBottom: '32px' }}>
          {getLoginPageSubTitle(step)}
        </Text>

        {/* CONTENT */}
        <Wrapper>
          <Form onSubmit={this.handleSubmit}>
            {(() => {
              switch (step) {
                case LoginSteps.ENTER_PASSWORD_EXCHANGE:
                  return (
                    <EnterPasswordExchange
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                    />
                  )
                case LoginSteps.ENTER_PASSWORD_WALLET:
                  return (
                    <EnterPasswordWallet
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                      isMobileViewLogin={isMobileViewLogin}
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
                case LoginSteps.UPGRADE_CONFIRM:
                  return (
                    <MergeAccountConfirm
                      {...this.props}
                      {...loginProps}
                      setStep={this.setStep}
                      initCaptcha={this.initCaptcha}
                    />
                  )
                case LoginSteps.UPGRADE_PASSWORD:
                  return <UpgradePassword {...this.props} {...loginProps} setStep={this.setStep} />
                case LoginSteps.UPGRADE_SUCCESS:
                  return <UpgradeSuccess {...this.props} setStep={this.setStep} />
                case LoginSteps.PRODUCT_PICKER_AFTER_AUTHENTICATION:
                case LoginSteps.PRODUCT_PICKER_BEFORE_AUTHENTICATION:
                  return <ProductPicker {...this.props} {...loginProps} setStep={this.setStep} />
                case LoginSteps.ENTER_EMAIL_GUID:
                default:
                  if (designatedProduct === ProductAuthOptions.EXCHANGE) {
                    return <ExchangeEnterEmail {...this.props} {...loginProps} />
                  }
                  return <WalletEnterEmailOrGuid {...this.props} {...loginProps} />
              }
            })()}
          </Form>
        </Wrapper>

        {/* FOOTER */}
        {!isMobileViewLogin && getLoginPageFooter(step, this.loginWithMobileClicked)}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  accountUnificationFlow: selectors.auth.getAccountUnificationFlowType(state),
  authPlatform: selectors.auth.getAuthPlatform(state),
  authType: selectors.auth.getAuthType(state) as Number,
  code: formValueSelector(LOGIN_FORM_NAME)(state, 'code'),
  data: getData(state),
  designatedProduct: selectors.auth.getDesignatedProduct(state) as ProductAuthOptions,
  exchangeLoginData: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  exchangePassword: formValueSelector(LOGIN_FORM_NAME)(state, 'exchangePassword'),
  exchangeTwoFA: formValueSelector(LOGIN_FORM_NAME)(state, 'exchangeTwoFA'),
  formMeta: getFormMeta(LOGIN_FORM_NAME)(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM_NAME)(state) as LoginFormType,
  guid: formValueSelector(LOGIN_FORM_NAME)(state, 'guid'),
  guidOrEmail: formValueSelector(LOGIN_FORM_NAME)(state, 'guidOrEmail'),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  jwtToken: selectors.auth.getJwtToken(state),
  language: selectors.preferences.getLanguage(state),
  password: formValueSelector(LOGIN_FORM_NAME)(state, 'password'),
  upgradePassword: formValueSelector('login')(state, 'upgradeAccountPassword') || ('' as string),
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type FormProps = {
  busy: boolean
  exchangeError?: ExchangeErrorCodes
  initCaptcha: () => void
  invalid: boolean
  isMobileViewLogin?: boolean
  loginError?: string
  pristine: boolean
  setStep: (step: LoginSteps) => void
  submitting: boolean
}

type StateProps = {
  captchaToken?: string
}
export type Props = ConnectedProps<typeof connector> & FormProps

const enhance = compose<any>(reduxForm({ form: LOGIN_FORM_NAME }), connector)

export default enhance(Login)
