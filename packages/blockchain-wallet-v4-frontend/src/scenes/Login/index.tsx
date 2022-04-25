import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import {
  AlertsState,
  CombinedLoginSteps,
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  MergeSteps,
  PlatformTypes,
  ProductAuthOptions,
  TwoFASetupSteps,
  UpgradeSteps
} from 'data/types'
import Loading from 'layouts/Auth/template.loading'
import { isBrowserSupported } from 'services/browser'

import Loading from '../loading.public'
import AuthSecondAccount from './AccountMerge/AuthSecondAccount'
import ConfirmTwoFA from './AccountMerge/ConfirmTwoFA'
import CreateNewPassword from './AccountMerge/CreateNewPassword'
import ErrorMerge from './AccountMerge/ErrorMerge'
import MergeOrSkip from './AccountMerge/MergeOrSkip'
import MergeSuccess from './AccountMerge/MergeSuccess'
import MergeWhatsNext from './AccountMerge/MergeWhatsNext'
import TwoFASecondAccount from './AccountMerge/TwoFASecondAccount'
import UpgradeOrSkip from './AccountUpgrade/2_0_UpgradeOrSkip'
import UpgradeOverview from './AccountUpgrade/3_0_UpgradeOverview'
import ErrorWalletCreation from './AccountUpgrade/3_1_1_ErrorWalletCreation'
import ErrorAccountUpgrade from './AccountUpgrade/3_1_2_ErrorAccountUpgrade'
import CreateWallet from './AccountUpgrade/3_1_CreateWallet'
import Select2faType from './AccountUpgrade/3_2_Select2faType'
import GoogleAuthSetup from './AccountUpgrade/3_3_1_GoogleAuthSetup'
import GoogleAuthVerify from './AccountUpgrade/3_3_2_GoogleAuthVerify'
import YubiKeySetup from './AccountUpgrade/3_4_1_YubiKeySetup'
import YubiKeyVerified from './AccountUpgrade/3_4_2_YubiKeyVerified'
import UpgradeSuccess from './AccountUpgrade/3_5_UpgradeSuccess'
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

  setStep = (step: CombinedLoginSteps) => {
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
    if (this.props.cache.unifiedAccount) {
      this.props.cacheActions.removeExchangeLogin()
    }
  }

  handleBackArrowClickExchange = () => {
    this.handleBackArrowClick()
    this.props.cacheActions.removeExchangeLogin()
    if (this.props.cache.unifiedAccount) {
      this.props.cacheActions.removeWalletLogin()
    }
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
    const { exchangeLoginDataR, formValues, productAuthMetadata, walletLoginDataR } = this.props
    const { platform, product } = productAuthMetadata
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID

    const { exchangeError } = exchangeLoginDataR.cata({
      Failure: (val) => ({ busy: false, exchangeError: val }),
      Loading: () => <Loading />,
      NotAsked: () => ({ busy: false, exchangeError: null }),
      Success: () => ({ busy: false, exchangeError: null })
    })

    const { busy, walletError } = walletLoginDataR.cata({
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
            // TODO: figure out how to split the step checking into different files
            switch (step) {
              // LOGIN STEPS
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
              // UPGRADE STEPS
              case UpgradeSteps.UPGRADE_OR_SKIP:
                return <UpgradeOrSkip {...loginProps} />
              case UpgradeSteps.UPGRADE_OVERVIEW:
                return <UpgradeOverview {...loginProps} />
              case UpgradeSteps.CREATE_WALLET:
                return <CreateWallet {...loginProps} />
              case UpgradeSteps.ERROR_WALLET_CREATION:
                return <ErrorWalletCreation {...loginProps} />
              case UpgradeSteps.ERROR_ACCOUNT_UPGRADE:
                return <ErrorAccountUpgrade {...loginProps} />
              case TwoFASetupSteps.SELECT_2FA_TYPE:
                return <Select2faType {...loginProps} />
              case TwoFASetupSteps.GOOGLE_AUTH_SETUP:
                return <GoogleAuthSetup {...loginProps} />
              case TwoFASetupSteps.GOOGLE_AUTH_VERIFY:
                return <GoogleAuthVerify {...loginProps} />
              case UpgradeSteps.UPGRADE_SUCCESS:
                return <UpgradeSuccess {...loginProps} />
              case TwoFASetupSteps.YUBIKEY_SETUP:
                return <YubiKeySetup {...loginProps} />
              case TwoFASetupSteps.YUBIKEY_VERIFIED:
                return <YubiKeyVerified {...loginProps} />
              // MERGE STEPS
              case MergeSteps.AUTH_SECOND_ACCOUNT:
                return <AuthSecondAccount {...loginProps} />
              case MergeSteps.CONFIRM_TWO_FA:
                return <ConfirmTwoFA {...loginProps} />
              case MergeSteps.CREATE_NEW_PASSWORD:
                return <CreateNewPassword {...loginProps} />
              case MergeSteps.ERROR:
                return <ErrorMerge {...loginProps} />
              case MergeSteps.MERGE_OR_SKIP:
                return <MergeOrSkip {...loginProps} />
              case MergeSteps.MERGE_WHATS_NEXT:
                return <MergeWhatsNext {...loginProps} />
              case MergeSteps.MERGE_SUCCESS:
                return <MergeSuccess {...loginProps} />
              case MergeSteps.TWO_FA_SECOND_ACCOUNT:
                return <TwoFASecondAccount {...loginProps} />
              // DEFAULT STEP
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
  exchangeLoginDataR: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType,
  goals: selectors.goals.getGoals(state),
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  jwtToken: selectors.auth.getExchangeSessionToken(state),
  magicLinkData: selectors.auth.getMagicLinkData(state),
  productAuthMetadata: selectors.auth.getProductAuthMetadata(state),
  walletLoginDataR: selectors.auth.getLogin(state) as RemoteDataType<any, any>
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
  setStep: (step: CombinedLoginSteps) => void
  submitting: boolean
  walletError?: string
  walletTabClicked?: () => void
}

type StateProps = {
  captchaToken?: string
}
export type Props = ConnectedProps<typeof connector> & OwnProps

const enhance = compose<React.ComponentType>(reduxForm({ form: LOGIN_FORM }), connector)

export default enhance(Login)
