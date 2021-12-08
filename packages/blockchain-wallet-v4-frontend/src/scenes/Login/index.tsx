import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import { actions, selectors } from 'data'
import {
  ExchangeErrorCodes,
  LoginFormType,
  LoginSteps,
  PlatformTypes,
  ProductAuthOptions
} from 'data/types'

// step templates
import Loading from '../loading.public'
import MergeAccountConfirm from './AccountUnification/MergeAccountConfirm'
import ProductPicker from './AccountUnification/ProductPicker'
import UpgradePassword from './AccountUnification/UpgradePassword'
import UpgradeSuccess from './AccountUnification/UpgradeSuccess'
import ExchangeEnterEmail from './Exchange/EnterEmail'
import EnterPasswordExchange from './Exchange/EnterPasswordExchange'
import TwoFAExchange from './Exchange/TwoFA'
import {
  getLoginPageFooter,
  getLoginPageSubTitle,
  getLoginPageTitle,
  LOGIN_FORM_NAME
} from './model'
import { getData } from './selectors'
import VerifyMagicLink from './VerifyMagicLink'
import CheckEmail from './Wallet/CheckEmail'
import WalletEnterEmailOrGuid from './Wallet/EnterEmailOrGuid'
import EnterPasswordWallet from './Wallet/EnterPasswordWallet'
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
    this.props.formActions.change(LOGIN_FORM_NAME, 'step', step)
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
    this.props.cacheActions.removedStoredLogin()
    this.props.formActions.destroy(LOGIN_FORM_NAME)
    this.setStep(LoginSteps.ENTER_EMAIL_GUID)
    this.props.authActions.clearLoginError()
    this.initCaptcha()
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

    const { exchangeBusy, exchangeError } = exchangeLoginData.cata({
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

    // TODO see if we still need busy
    const loginProps = {
      busy,
      exchangeError,
      handleBackArrowClick: this.handleBackArrowClick,
      isMobileViewLogin: platform === PlatformTypes.ANDROID || platform === PlatformTypes.IOS,
      setStep: this.setStep,
      walletError,
      ...this.props
    }

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

        <Form onSubmit={this.handleSubmit}>
          {(() => {
            switch (step) {
              case LoginSteps.ENTER_PASSWORD_EXCHANGE:
                return <EnterPasswordExchange {...loginProps} />
              case LoginSteps.ENTER_PASSWORD_WALLET:
                return <EnterPasswordWallet {...loginProps} />
              case LoginSteps.TWO_FA_EXCHANGE:
                return <TwoFAExchange {...loginProps} />
              case LoginSteps.TWO_FA_WALLET:
                return <TwoFAWallet {...loginProps} />
              case LoginSteps.CHECK_EMAIL:
                return <CheckEmail {...loginProps} />
              case LoginSteps.VERIFY_MAGIC_LINK:
                return <VerifyMagicLink {...loginProps} />
              case LoginSteps.UPGRADE_CONFIRM:
                return <MergeAccountConfirm {...loginProps} />
              case LoginSteps.UPGRADE_PASSWORD:
                return <UpgradePassword {...loginProps} />
              case LoginSteps.UPGRADE_SUCCESS:
                return <UpgradeSuccess {...loginProps} />
              case LoginSteps.PRODUCT_PICKER_AFTER_AUTHENTICATION:
              case LoginSteps.PRODUCT_PICKER_BEFORE_AUTHENTICATION:
                return <ProductPicker {...loginProps} />
              case LoginSteps.ENTER_EMAIL_GUID:
              default:
                return product === ProductAuthOptions.EXCHANGE ? (
                  <ExchangeEnterEmail {...loginProps} />
                ) : (
                  <WalletEnterEmailOrGuid {...loginProps} />
                )
            }
          })()}
        </Form>

        {/* FOOTER */}
        {!loginProps.isMobileViewLogin && getLoginPageFooter(step)}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  accountUnificationFlow: selectors.auth.getAccountUnificationFlowType(state),
  authType: selectors.auth.getAuthType(state) as Number,
  data: getData(state),
  exchangeLoginData: selectors.auth.getExchangeLogin(state) as RemoteDataType<any, any>,
  formValues: selectors.form.getFormValues(LOGIN_FORM_NAME)(state) as LoginFormType,
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
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type FormProps = {
  busy?: boolean
  exchangeError?: ExchangeErrorCodes
  handleBackArrowClick: () => void
  invalid: boolean
  isMobileViewLogin?: boolean
  pristine: boolean
  setStep: (step: LoginSteps) => void
  submitting: boolean
  walletError?: any
}

type StateProps = {
  captchaToken?: string
}
export type Props = ConnectedProps<typeof connector> & FormProps

const enhance = compose<any>(reduxForm({ form: LOGIN_FORM_NAME }), connector)

export default enhance(Login)
