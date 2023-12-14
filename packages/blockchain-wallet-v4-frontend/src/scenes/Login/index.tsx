import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { getFormValues, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { auth as authActions, cache as cacheActions } from 'data/actions'
import { trackEvent } from 'data/analytics/slice'
import { LOGIN_FORM } from 'data/auth/model'
import { getExchangeLogin, getLogin, getProductAuthMetadata } from 'data/auth/selectors'
import { getCache } from 'data/cache/selectors'
import {
  Analytics,
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthMetadata,
  ProductAuthOptions
} from 'data/types'

import UrlNoticeBar from './components/UrlNoticeBar'
import ExchangeEnterEmail from './Exchange/EnterEmail'
import EnterPasswordExchange from './Exchange/EnterPassword'
import InstitutionalPortal from './Exchange/Institutional'
import TwoFAExchange from './Exchange/TwoFA'
// SOFI Login
import Email from './Sofi/Email'
import SofiSuccess from './Sofi/Success'
import SofiVerifyID from './Sofi/VerifySSN'
import VerifyMagicLink from './VerifyMagicLink'
import CheckEmail from './Wallet/CheckEmail'
import WalletEnterEmailOrGuid from './Wallet/EnterEmailOrGuid'
import EnterPasswordWallet from './Wallet/EnterPassword'
import TwoFAWallet from './Wallet/TwoFA'

const Login = (props) => {
  const { change, destroy, ...reduxFormProps } = props
  const formActions = { change, destroy }

  // Used here
  const cache = useSelector(getCache)
  const exchangeLoginDataR = useSelector(getExchangeLogin) as RemoteDataType<any, any>
  const formValues = useSelector(getFormValues(LOGIN_FORM)) as LoginFormType
  const productAuthMetadata = useSelector(getProductAuthMetadata)
  const walletLoginDataR = useSelector(getLogin) as RemoteDataType<any, any>

  const dispatch = useDispatch()

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

  const handleBackArrowClick = () => {
    formActions.destroy()
    formActions.change('step', LoginSteps.ENTER_EMAIL_GUID)
    dispatch(authActions.clearLoginError())
  }

  const handleBackArrowClickWallet = () => {
    handleBackArrowClick()
    dispatch(cacheActions.removeWalletLogin())
    if (cache.unifiedAccount) {
      dispatch(cacheActions.removeExchangeLogin())
    }
  }

  const handleBackArrowClickExchange = () => {
    handleBackArrowClick()
    dispatch(cacheActions.removeExchangeLogin())
    if (cache.unifiedAccount) {
      dispatch(cacheActions.removeWalletLogin())
    }
  }

  const exchangeTabClicked = () => {
    const { exchangeEmail } = cache
    dispatch(authActions.setProductAuthMetadata({ product: ProductAuthOptions.EXCHANGE }))
    dispatch(push('/login?product=exchange'))
    if (exchangeEmail) {
      formActions.change('exchangeEmail', exchangeEmail)
      formActions.change('step', LoginSteps.ENTER_PASSWORD_EXCHANGE)
    } else {
      formActions.change('step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  const walletTabClicked = () => {
    const { guidStored, lastEmail, lastGuid } = cache
    dispatch(authActions.setProductAuthMetadata({ product: ProductAuthOptions.WALLET }))
    dispatch(push('/login?product=wallet'))
    if (guidStored || lastGuid) {
      formActions.change('guid', lastGuid || guidStored)
      formActions.change('email', lastEmail)
      formActions.change('step', LoginSteps.ENTER_PASSWORD_WALLET)
    } else {
      formActions.change('step', LoginSteps.ENTER_EMAIL_GUID)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(authActions.continueLoginProcess())
  }

  const isMobilePlatform = platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS

  const loginProps = {
    ...reduxFormProps,
    busy, // TODO see if we still need busy
    exchangeError,
    exchangeTabClicked,
    formValues,
    handleBackArrowClickExchange,
    handleBackArrowClickWallet,
    isMobilePlatform,
    productAuthMetadata,
    walletError,
    walletTabClicked
  }

  useEffect(() => {
    dispatch(authActions.initializeLogin())

    if (window?._SardineContext) {
      window._SardineContext.updateConfig({
        flow: 'LOGIN'
      })
    }

    dispatch(
      trackEvent({
        key: Analytics.LOGIN_VIEWED,
        properties: {
          device_origin: productAuthMetadata?.platform || 'WEB',
          originalTimestamp: new Date().toISOString()
        }
      })
    )
  }, [])

  return (
    <Form onSubmit={handleSubmit}>
      {(() => {
        switch (step) {
          case LoginSteps.SOFI_EMAIL:
            return <Email {...loginProps} />
          case LoginSteps.INSTITUTIONAL_PORTAL:
            return <InstitutionalPortal {...loginProps} />
          case LoginSteps.ENTER_PASSWORD_EXCHANGE:
            return (
              <>
                {!isMobilePlatform && <UrlNoticeBar />}
                <EnterPasswordExchange {...loginProps} />
              </>
            )
          case LoginSteps.ENTER_PASSWORD_WALLET:
            return (
              <>
                {!isMobilePlatform && <UrlNoticeBar />}
                <EnterPasswordWallet {...loginProps} />
              </>
            )
          case LoginSteps.TWO_FA_EXCHANGE:
            return (
              <>
                {!isMobilePlatform && <UrlNoticeBar />}
                <TwoFAExchange {...loginProps} />
              </>
            )
          case LoginSteps.TWO_FA_WALLET:
            return (
              <>
                {!isMobilePlatform && <UrlNoticeBar />}
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
            return <SofiSuccess {...loginProps} />

          case LoginSteps.ENTER_EMAIL_GUID:
          default:
            const LoginComponent =
              product === ProductAuthOptions.EXCHANGE ? ExchangeEnterEmail : WalletEnterEmailOrGuid

            return (
              <>
                {!isMobilePlatform && <UrlNoticeBar />}
                <LoginComponent {...loginProps} />
              </>
            )
        }
      })()}
    </Form>
  )
}

export type Props = {
  busy?: boolean
  exchangeError?: ExchangeErrorCodes
  exchangeTabClicked?: () => void
  formValues: LoginFormType
  handleBackArrowClickExchange: () => void
  handleBackArrowClickWallet: () => void
  invalid?: boolean
  isMobilePlatform: boolean
  pristine?: boolean
  productAuthMetadata: ProductAuthMetadata
  submitting: boolean
  walletError?: string
  walletTabClicked?: () => void
}

export default reduxForm({
  form: LOGIN_FORM,
  initialValues: { step: LoginSteps.ENTER_EMAIL_GUID }
})(Login)
