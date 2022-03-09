import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, pathOr, propEq } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { RemoteDataType, WalletOptionsType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import BuyGoal from './BuyGoal'
import ExchangeLinkGoal from './ExchangeLinkGoal'
import SignupLanding from './SignupLanding'
import { GoalDataType, SignupFormInitValuesType, SignupFormType } from './types'

const SignupWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`

const SIGNUP_FORM = 'register'

class SignupContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  StateProps
> {
  constructor(props) {
    super(props)
    this.state = {
      captchaToken: undefined,
      showForm: props.search.includes('showWallet'),
      showState: false
    }
  }

  componentDidMount() {
    const { websocketActions } = this.props
    // start sockets to ensure email verify flow is detected
    websocketActions.startSocket()
    this.initCaptcha()
  }

  initCaptcha = (callback?) => {
    /* eslint-disable */
    if (!window.grecaptcha || !window.grecaptcha.enterprise) return
    window.grecaptcha.enterprise.ready(() => {
      window.grecaptcha.enterprise
        .execute(window.CAPTCHA_KEY, { action: 'SIGNUP' })
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

  onCountryChange = (e: React.ChangeEvent<HTMLInputElement> | undefined, value: string) => {
    this.setDefaultCountry(value)
    this.props.formActions.clearFields(SIGNUP_FORM, false, false, 'state')
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { captchaToken } = this.state
    const { authActions, formValues, language } = this.props
    const { country, email, password, state } = formValues

    // sometimes captcha doesn't mount correctly (race condition?)
    // if it's undefined, try to re-init for token
    if (!captchaToken) {
      return this.initCaptcha(
        authActions.register({ captchaToken, country, email, language, password, state })
      )
    }
    // we have a captcha token, continue Signup process
    authActions.register({
      captchaToken,
      country,
      email,
      initCaptcha: this.initCaptcha,
      language,
      password,
      state
    })
  }

  setCountryOnLoad = (country: string) => {
    this.setDefaultCountry(country)
    this.props.formActions.change(SIGNUP_FORM, 'country', country)
  }

  setDefaultCountry = (country: string) => {
    this.setState({ showState: country === 'US' })
  }

  toggleSignupFormVisibility = () => {
    this.setState({ showForm: true })
  }

  render() {
    const { goals, isLoadingR } = this.props
    const isFormSubmitting = Remote.Loading.is(isLoadingR)

    // pull email from simple buy goal if it exists
    const email = pathOr('', ['data', 'email'], find(propEq('name', 'buySell'), goals))
    const signupInitialValues = (email ? { email } : {}) as SignupFormInitValuesType
    const isLinkAccountGoal = !!find(propEq('name', 'linkAccount'), goals)
    const isBuyGoal = !!find(propEq('name', 'buySell'), goals)

    const subviewProps = {
      isFormSubmitting,
      isLinkAccountGoal,
      onCountrySelect: this.onCountryChange,
      onSignupSubmit: this.onSubmit,
      setDefaultCountry: this.setCountryOnLoad,
      showForm: this.state.showForm,
      showState: this.state.showState,
      toggleSignupFormVisibility: this.toggleSignupFormVisibility,
      ...this.props, // order here matters as we may need to override initial form values!
      initialValues: signupInitialValues
    }

    return (
      <SignupWrapper>
        {isLinkAccountGoal && <ExchangeLinkGoal {...subviewProps} />}
        {isBuyGoal && <BuyGoal {...subviewProps} />}
        {!isLinkAccountGoal && !isBuyGoal && <SignupLanding {...subviewProps} />}
      </SignupWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    exchange: 'https://exchange.blockchain.com'
  } as WalletOptionsType['domains']),
  formValues: selectors.form.getFormValues(SIGNUP_FORM)(state) as SignupFormType,
  goals: selectors.goals.getGoals(state) as GoalDataType,
  isLoadingR: selectors.auth.getRegistering(state) as RemoteDataType<string, undefined>,
  language: selectors.preferences.getLanguage(state),
  search: selectors.router.getSearch(state) as string,
  signupCountryEnabled: selectors.core.walletOptions
    .getFeatureSignupCountry(state)
    .getOrElse(false) as boolean
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  websocketActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  domains: WalletOptionsType['domains']
  formValues: SignupFormType
  goals: GoalDataType
  isLoadingR: RemoteDataType<string, undefined>
  language: string
  search: string
  signupCountryEnabled: boolean
}
type StateProps = {
  captchaToken?: string
  showForm: boolean
  showState: boolean
}

export type Props = ConnectedProps<typeof connector> & LinkStatePropsType

const enhance = compose(reduxForm<{}, Props>({ form: SIGNUP_FORM }), connector)

export default enhance(SignupContainer) as React.ComponentClass<Props>
