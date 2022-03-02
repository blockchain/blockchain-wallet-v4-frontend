import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import { Form } from 'components/Form'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import {
  AlertsState,
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from 'data/types'
import { isBrowserSupported } from 'services/browser'

import Loading from '../loading.auth'
import MergeAccountConfirm from './AccountUnification/MergeAccountConfirm'
import UpgradePassword from './AccountUnification/UpgradePassword'
import UpgradeSuccess from './AccountUnification/UpgradeSuccess'
import UrlNoticeBar from './components/UrlNoticeBar'
import ExchangeEnterEmail from './Exchange/EnterEmail'
import EnterPasswordExchange from './Exchange/EnterPassword'
import InstitutionalPortal from './Exchange/Institutional'
import TwoFAExchange from './Exchange/TwoFA'
import { getData } from './selectors'
import VerifyMagicLink from './VerifyMagicLink'
import CheckEmail from './Wallet/CheckEmail'
import WalletEnterEmailOrGuid from './Wallet/EnterEmailOrGuid'
import EnterPasswordWallet from './Wallet/EnterPassword'
import TwoFAWallet from './Wallet/TwoFA'

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
    this.props.formActions.change(LOGIN_FORM, 'step', step)
  }

  initCaptcha = (callback?) => {
    /* eslint-disable */
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise
        .execute(window.CAPTCHA_KEY, { action: 'LOGIN' })
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

  handleBackArrowClick = () => {
    const { authActions, formActions } = this.props
    formActions.destroy(LOGIN_FORM)
    this.setStep(LoginSteps.ENTER_EMAIL_GUID)
    authActions.clearLoginError()
    this.initCaptcha()
  }

  handleBackArrowClickWallet = () => {
    this.handleBackArrowClick()
    this.props.cacheActions.removeWalletLogin()
  }

  handleBackArrowClickExchange = () => {
    this.handleBackArrowClick()
    this.props.cacheActions.removeExchangeLogin()
  }

  exchangeTabClicked = () => {
    const { exchangeEmail } = this.props.cache
    const { authActions, formActions, routerActions } = this.props
    authActions.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE })
    routerActions.push('/login?product=exchange')
    if (exchangeEmail) {
      formActions.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail)
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE)
    } else {
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  walletTabClicked = () => {
    const { lastEmail, lastGuid, storedGuid } = this.props.cache
    const { authActions, formActions, routerActions } = this.props
    authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET })
    routerActions.push('/login?product=wallet')
    if (storedGuid || lastGuid) {
      formActions.change(LOGIN_FORM, 'guid', lastGuid || storedGuid)
      formActions.change(LOGIN_FORM, 'email', lastEmail)
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET)
    } else {
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // sometimes captcha doesnt mount correctly (race condition?)
    // if it's undefined, try to re-init for token
    if (!this.state.captchaToken) {
      return this.initCaptcha(
        this.props.authActions.continueLoginProcess({
          captchaToken: this.state.captchaToken,
          initCaptcha: this.initCaptcha
        })
      )
    }
    // we have a captcha token, continue login process
    this.props.authActions.continueLoginProcess({
      captchaToken: this.state.captchaToken,
      initCaptcha: this.initCaptcha
    })
  }

  render() {
    const { exchangeLoginData, formValues, productAuthMetadata, walletLoginData } = this.props
    const { platform, product } = productAuthMetadata
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID

    const { exchangeError } = exchangeLoginData.cata({
      Failure: (val) => ({ busy: false, exchangeError: val }),
      Loading: () => <Loading />,
      NotAsked: () => ({ busy: false, exchangeError: null }),
      Success: () => ({ busy: false, exchangeError: null })
    })

    const { busy, walletError } = walletLoginData.cata({
      Failure: (val) => ({ busy: false, walletError: val }),
      Loading: () => <Loading />,
      NotAsked: () => ({ busy: false, walletError: null }),
      Success: () => ({ busy: false, walletError: null })
    })

    const loginProps = {
      busy, // TODO see if we still need busy
      exchangeError,
      exchangeTabClicked: this.exchangeTabClicked,
      isMobileViewLogin: platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS,
      walletError,
      ...this.props,
      handleBackArrowClickExchange: this.handleBackArrowClickExchange,
      handleBackArrowClickWallet: this.handleBackArrowClickWallet,
      isBrowserSupported: isBrowserSupported(),
      setStep: this.setStep,
      walletTabClicked: this.walletTabClicked
    }

    const { isMobileViewLogin } = loginProps

    return (
      <>
        {/* CONTENT */}
        <Form onSubmit={this.handleSubmit}>
          {(() => {
            switch (step) {
              case LoginSteps.INSTITUTIONAL_PORTAL:
                return <InstitutionalPortal {...loginProps} />
              case LoginSteps.ENTER_PASSWORD_EXCHANGE:
                return (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <EnterPasswordExchange {...loginProps} />
                  </>
                )
              case LoginSteps.ENTER_PASSWORD_WALLET:
                return (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <EnterPasswordWallet {...loginProps} />
                  </>
                )
              case LoginSteps.TWO_FA_EXCHANGE:
                return (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <TwoFAExchange {...loginProps} />
                  </>
                )
              case LoginSteps.TWO_FA_WALLET:
                return (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <TwoFAWallet {...loginProps} />
                  </>
                )
              case LoginSteps.CHECK_EMAIL:
                return <CheckEmail {...loginProps} handleSubmit={this.handleSubmit} />
              case LoginSteps.VERIFY_MAGIC_LINK:
                return <VerifyMagicLink {...loginProps} />
              case LoginSteps.UPGRADE_CONFIRM:
                return <MergeAccountConfirm {...loginProps} />
              case LoginSteps.UPGRADE_PASSWORD:
                return <UpgradePassword {...loginProps} />
              case LoginSteps.UPGRADE_SUCCESS:
                return <UpgradeSuccess {...loginProps} />
              case LoginSteps.ENTER_EMAIL_GUID:
              default:
                return product === ProductAuthOptions.EXCHANGE ? (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <ExchangeEnterEmail {...loginProps} />
                  </>
                ) : (
                  <>
                    {!isMobileViewLogin && <UrlNoticeBar />}
                    <WalletEnterEmailOrGuid {...loginProps} />
                  </>
                )
            }
          })()}
        </Form>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  accountUnificationFlow: selectors.auth.getAccountUnificationFlowType(state),
  alerts: selectors.alerts.selectAlerts(state) as AlertsState,
  authType: selectors.auth.getAuthType(state) as Number,
  cache: selectors.cache.getCache(state),
  data: getData(state),
  exchangeLoginData: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType,
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  jwtToken: selectors.auth.getJwtToken(state),
  magicLinkData: selectors.auth.getMagicLinkData(state),
  productAuthMetadata: selectors.auth.getProductAuthMetadata(state),
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  busy?: boolean
  exchangeError?: ExchangeErrorCodes
  exchangeTabClicked?: () => void
  handleBackArrowClickExchange: () => void
  handleBackArrowClickWallet: () => void
  invalid: boolean
  isBrowserSupported: boolean | undefined
  isMobileViewLogin?: boolean
  pristine: boolean
  setStep: (step: LoginSteps) => void
  submitting: boolean
  walletError?: any
  walletTabClicked?: () => void
}

type StateProps = {
  captchaToken?: string
}
export type Props = ConnectedProps<typeof connector> & OwnProps

const enhance = compose<any>(reduxForm({ form: LOGIN_FORM }), connector)

export default enhance(Login)
