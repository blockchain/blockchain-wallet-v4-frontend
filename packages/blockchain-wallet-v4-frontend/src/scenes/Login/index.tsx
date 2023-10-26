import React, { useEffect } from 'react'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getFormValues, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { auth as authActions, cache as cacheActions, router as routerActions } from 'data/actions'
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
  ProductAuthOptions,
  UnifiedAccountRedirectType
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

const Login = (props) => {
  const { change, destroy, ...reduxFormProps } = props
  const formActions = { change, destroy }

  // not used here
  const magicLinkData = useSelector(getMagicLinkData)

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
    dispatch(routerActions.push('/login?product=exchange'))
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
    dispatch(routerActions.push('/login?product=wallet'))
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

  const isMobileViewLogin = platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS

  const loginProps = {
    ...props,
    busy, // TODO see if we still need busy
    cache,
    exchangeError,
    exchangeTabClicked,
    formValues,
    handleBackArrowClickExchange,
    handleBackArrowClickWallet,
    magicLinkData,
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
            return <CheckEmail {...loginProps} handleSubmit={handleSubmit} />
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
  )
}

const mapStateToProps = (state) => ({
  cache: selectors.cache.getCache(state),
  formValues: selectors.form.getFormValues(LOGIN_FORM)(state) as LoginFormType,
  initialRedirect: selectors.goals.getInitialRedirect(state) as UnifiedAccountRedirectType,
  initialValues: {
    step: LoginSteps.ENTER_EMAIL_GUID
  },
  isSofi: selectors.auth.getIsSofi(state),
  jwtToken: selectors.auth.getJwtToken(state),
  magicLinkData: selectors.auth.getMagicLinkData(state),
  productAuthMetadata: selectors.auth.getProductAuthMetadata(state)
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
  pristine: boolean
  submitting: boolean
  walletError?: string
  walletTabClicked?: () => void
}

export type Props = ConnectedProps<typeof connector> & OwnProps

export default reduxForm({
  form: LOGIN_FORM,
  initialValues: { step: LoginSteps.ENTER_EMAIL_GUID }
})(Login)
