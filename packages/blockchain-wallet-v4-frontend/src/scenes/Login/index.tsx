import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormProps, getFormValues, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { auth as authActions, cache as cacheActions } from 'data/actions'
import { trackEvent } from 'data/analytics/slice'
import { LOGIN_FORM } from 'data/auth/model'
import {
  getExchangeLogin,
  getLogin,
  getMagicLinkData,
  getProductAuthMetadata
} from 'data/auth/selectors'
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
  const magicLinkMetadata = useSelector(getMagicLinkData)
  const productAuthMetadata = useSelector(getProductAuthMetadata)
  const walletLoginDataR = useSelector(getLogin) as RemoteDataType<any, any>

  const dispatch = useDispatch()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(authActions.continueLoginProcess())
  }

  const isPlatformMobile = [PlatformTypes.ANDROID, PlatformTypes.IOS].includes(
    productAuthMetadata.platform as PlatformTypes
  )

  const isMagicLinkMobile = [PlatformTypes.ANDROID, PlatformTypes.IOS].includes(
    magicLinkMetadata?.platform_type as PlatformTypes
  )

  const loginProps = {
    ...reduxFormProps,
    busy, // TODO see if we still need busy
    exchangeError,
    formValues,
    handleBackArrowClickExchange,
    handleBackArrowClickWallet,
    isMobilePlatform: isMagicLinkMobile,
    productAuthMetadata,
    walletError
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
                {!isPlatformMobile && <UrlNoticeBar />}
                <EnterPasswordExchange {...loginProps} />
              </>
            )
          case LoginSteps.ENTER_PASSWORD_WALLET:
            return (
              <>
                {!isPlatformMobile && <UrlNoticeBar />}
                <EnterPasswordWallet {...loginProps} />
              </>
            )
          case LoginSteps.TWO_FA_EXCHANGE:
            return (
              <>
                {!isPlatformMobile && <UrlNoticeBar />}
                <TwoFAExchange {...loginProps} />
              </>
            )
          case LoginSteps.TWO_FA_WALLET:
            return (
              <>
                {!isPlatformMobile && <UrlNoticeBar />}
                <TwoFAWallet {...loginProps} />
              </>
            )
          case LoginSteps.SOFI_VERIFY_ID:
            return <SofiVerifyID {...loginProps} />
          case LoginSteps.CHECK_EMAIL:
            return <CheckEmail {...loginProps} handleSubmit={handleSubmit} />
          case LoginSteps.VERIFY_MAGIC_LINK:
            return <VerifyMagicLink />
          case LoginSteps.SOFI_SUCCESS:
            return <SofiSuccess />

          case LoginSteps.ENTER_EMAIL_GUID:
          default:
            const LoginComponent =
              productAuthMetadata.product === ProductAuthOptions.EXCHANGE
                ? ExchangeEnterEmail
                : WalletEnterEmailOrGuid

            return (
              <>
                {!isPlatformMobile && <UrlNoticeBar />}
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
}

export default reduxForm({
  form: LOGIN_FORM,
  initialValues: { step: LoginSteps.ENTER_EMAIL_GUID }
})(Login)
