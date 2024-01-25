import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import {
  Analytics,
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from 'data/types'

import UrlNoticeBar from './components/UrlNoticeBar'
import ExchangeEnterEmail from './Exchange/EnterEmail'
import EnterPasswordExchange from './Exchange/EnterPassword'
import InstitutionalPortal from './Exchange/Institutional'
import TwoFAExchange from './Exchange/TwoFA'
import { getData } from './selectors'
// SOFI Login
import Email from './Sofi/Email'
import SofiSuccess from './Sofi/Success'
import SofiVerifyID from './Sofi/VerifySSN'
import VerifyMagicLink from './VerifyMagicLink'
import CheckEmail from './Wallet/CheckEmail'
import WalletEnterEmailOrGuid from './Wallet/EnterEmailOrGuid'
import EnterPasswordWallet from './Wallet/EnterPassword'
import TwoFAWallet from './Wallet/TwoFA'

const Login = (props: Props) => {
  const setStep = (step: LoginSteps) => {
    props.formActions.change(LOGIN_FORM, 'step', step)
  }

  const handleBackArrowClick = () => {
    const { authActions, formActions } = props
    formActions.destroy(LOGIN_FORM)
    setStep(LoginSteps.ENTER_EMAIL_GUID)
    authActions.clearLoginError()
  }

  const handleBackArrowClickWallet = () => {
    handleBackArrowClick()
    props.cacheActions.removeWalletLogin()
    if (props.cache.unifiedAccount) {
      props.cacheActions.removeExchangeLogin()
    }
  }

  const handleBackArrowClickExchange = () => {
    handleBackArrowClick()
    props.cacheActions.removeExchangeLogin()
    if (props.cache.unifiedAccount) {
      props.cacheActions.removeWalletLogin()
    }
  }

  const exchangeTabClicked = () => {
    const { exchangeEmail } = props.cache
    const { authActions, formActions, routerActions } = props
    authActions.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE })
    routerActions.push('/login?product=exchange')
    if (exchangeEmail) {
      formActions.change(LOGIN_FORM, 'exchangeEmail', exchangeEmail)
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_PASSWORD_EXCHANGE)
    } else {
      formActions.change(LOGIN_FORM, 'step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  const walletTabClicked = () => {
    const { guidStored, lastEmail, lastGuid } = props.cache
    const { authActions, formActions, routerActions } = props
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

  const handleSubmit = (e) => {
    e.preventDefault()
    props.authActions.continueLoginProcess()
  }

  useEffect(() => {
    props.authActions.initializeLogin()
    if (window?._SardineContext) {
      window._SardineContext.updateConfig({
        flow: 'LOGIN'
      })
    }
    props.analyticsActions.trackEvent({
      key: Analytics.LOGIN_VIEWED,
      properties: {
        device_origin: props?.productAuthMetadata?.platform || 'WEB',
        originalTimestamp: new Date().toISOString()
      }
    })
  }, [])

  const { exchangeLoginDataR, formValues, productAuthMetadata, walletLoginDataR } = props
  const { platform, product } = productAuthMetadata
  const step = formValues?.step ?? LoginSteps.ENTER_EMAIL_GUID

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
    exchangeTabClicked,
    walletError,
    ...props,
    handleBackArrowClickExchange,
    handleBackArrowClickWallet,
    setStep,
    walletTabClicked
  }

  const isMobileViewLogin = platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS

  const getComponentByStep = () => {
    switch (step) {
      case LoginSteps.SOFI_EMAIL:
        return <Email {...loginProps} />
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
      case LoginSteps.SOFI_VERIFY_ID:
        return <SofiVerifyID {...loginProps} />
      case LoginSteps.CHECK_EMAIL:
        return <CheckEmail {...loginProps} handleSubmit={handleSubmit} />
      case LoginSteps.VERIFY_MAGIC_LINK:
        return <VerifyMagicLink {...loginProps} />
      case LoginSteps.SOFI_SUCCESS:
        return <SofiSuccess />

      case LoginSteps.ENTER_EMAIL_GUID:
      default: {
        const Component =
          product === ProductAuthOptions.EXCHANGE ? ExchangeEnterEmail : WalletEnterEmailOrGuid
        return (
          <>
            {!isMobileViewLogin && <UrlNoticeBar />}
            <Component {...loginProps} />
          </>
        )
      }
    }
  }

  return <Form onSubmit={handleSubmit}>{getComponentByStep()}</Form>
}

const mapStateToProps = (state) => ({
  accountUnificationFlow: selectors.auth.getAccountUnificationFlowType(state),
  cache: selectors.cache.getCache(state),
  data: getData(state),
  exchangeLoginDataR: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType,
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
  setStep: (step: LoginSteps) => void
  walletError?: string
  walletTabClicked?: () => void
}

export type Props = ConnectedProps<typeof connector> & InjectedFormProps<{}, OwnProps> & OwnProps

const enhance = compose<React.ComponentType>(
  reduxForm({
    form: LOGIN_FORM,
    initialValues: {
      step: LoginSteps.ENTER_EMAIL_GUID
    }
  }),
  connector
)

export default enhance(Login)
