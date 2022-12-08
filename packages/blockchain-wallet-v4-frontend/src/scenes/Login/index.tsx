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
  Analytics,
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions,
  UnifiedAccountRedirectType
} from 'data/types'

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

class Login extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  componentDidMount() {
    this.props.authActions.initializeLogin()
    if (window?._SardineContext) {
      window._SardineContext.updateConfig({
        flow: 'LOGIN'
      })
    }
    this.props.analyticsActions.trackEvent({
      key: Analytics.LOGIN_VIEWED,
      properties: {
        device_origin: this.props?.productAuthMetadata?.platform || 'WEB',
        originalTimestamp: new Date().toISOString()
      }
    })
  }

  setStep = (step: LoginSteps) => {
    this.props.formActions.change(LOGIN_FORM, 'step', step)
  }

  handleBackArrowClick = () => {
    const { authActions, formActions } = this.props
    formActions.destroy(LOGIN_FORM)
    this.setStep(LoginSteps.ENTER_EMAIL_GUID)
    authActions.clearLoginError()
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
    const { guidStored, lastEmail, lastGuid } = this.props.cache
    const { authActions, formActions, routerActions } = this.props
    authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET })
    routerActions.push('/login?product=wallet')
    if (guidStored || lastGuid) {
      formActions.change(LOGIN_FORM, 'guid', lastGuid || guidStored)
      formActions.change(LOGIN_FORM, 'email', lastEmail)
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_WALLET)
    } else {
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.authActions.continueLoginProcess()
  }

  render() {
    const { exchangeLoginDataR, formValues, productAuthMetadata, walletLoginDataR } = this.props
    const { platform, product } = productAuthMetadata
    const { step } = formValues || LoginSteps.ENTER_EMAIL_GUID

    const { exchangeError } = exchangeLoginDataR.cata({
      Failure: (val) => ({ busy: false, exchangeError: val }),
      Loading: () => ({ busy: true, exchangeError: null }),
      NotAsked: () => ({ busy: false, exchangeError: null }),
      Success: () => ({ busy: false, exchangeError: null })
    })

    const { busy, walletError } = walletLoginDataR.cata({
      Failure: (val) => ({ busy: false, walletError: val }),
      Loading: () => ({ busy: true, walletError: null }),
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
  authType: selectors.auth.getAuthType(state) as number,
  cache: selectors.cache.getCache(state),
  data: getData(state),
  exchangeLoginDataR: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType,
  initialRedirect: selectors.goals.getInitialRedirect(state) as UnifiedAccountRedirectType,
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  jwtToken: selectors.auth.getJwtToken(state),
  magicLinkData: selectors.auth.getMagicLinkData(state),
  productAuthMetadata: selectors.auth.getProductAuthMetadata(state),
  walletLoginDataR: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
  isMobileViewLogin?: boolean
  pristine: boolean
  setStep: (step: LoginSteps) => void
  submitting: boolean
  walletError?: string
  walletTabClicked?: () => void
}

export type Props = ConnectedProps<typeof connector> & OwnProps

const enhance = compose<React.ComponentType>(reduxForm({ form: LOGIN_FORM }), connector)

export default enhance(Login)
