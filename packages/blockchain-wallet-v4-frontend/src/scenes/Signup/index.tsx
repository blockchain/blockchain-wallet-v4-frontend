import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, pathOr, propEq } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from 'blockchain-wallet-v4/src'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import BuyGoal from './BuyGoal'
import ExchangeLinkGoal from './ExchangeLinkGoal'
import SignupLanding from './SignupLanding'
import { GeoLocationType, GoalDataType, SignupFormInitValuesType, SignupFormType } from './types'

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
      showForm: props.search.includes('showWallet'),
      showState: false
    }
  }

  componentDidMount() {
    this.props.authActions.getUserGeoLocation()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { authActions, formValues, language } = this.props
    const { country, email, password, state } = formValues
    authActions.register(email, password, language, country, state)
  }

  toggleSignupFormVisibility = () => {
    this.setState({ showForm: true })
  }

  onCountryChange = (e: React.SyntheticEvent, value: string) => {
    this.setDefaultCountry(value)
    this.props.formActions.clearFields(SIGNUP_FORM, false, false, 'state')
  }

  setDefaultCountry = (country: string) => {
    this.setState({ showState: country === 'US' })
  }

  render() {
    const { goals, isLoadingR, signupCountryEnabled, userGeoData } = this.props
    const isFormSubmitting = Remote.Loading.is(isLoadingR)

    // pull email from simple buy goal if it exists
    const email = pathOr('', ['data', 'email'], find(propEq('name', 'simpleBuy'), goals))
    const signupInitialValues = (email ? { email } : {}) as SignupFormInitValuesType
    if (userGeoData?.countryCode && signupCountryEnabled) {
      signupInitialValues.country = userGeoData.countryCode
    }
    const isLinkAccountGoal = !!find(propEq('name', 'linkAccount'), goals)
    const isBuyGoal = !!find(propEq('name', 'simpleBuy'), goals)

    const subviewProps = {
      initialValues: signupInitialValues,
      isFormSubmitting,
      isLinkAccountGoal,
      onCountrySelect: this.onCountryChange,
      onSignupSubmit: this.onSubmit,
      showForm: this.state.showForm,
      showState: this.state.showState,
      signupCountryEnabled,
      toggleSignupFormVisibility: this.toggleSignupFormVisibility,
      ...this.props
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
  formValues: selectors.form.getFormValues(SIGNUP_FORM)(state) as SignupFormType,
  goals: selectors.goals.getGoals(state) as GoalDataType,
  isLoadingR: selectors.auth.getRegistering(state) as RemoteDataType<string, undefined>,
  language: selectors.preferences.getLanguage(state),
  search: selectors.router.getSearch(state) as string,
  signupCountryEnabled: selectors.core.walletOptions
    .getFeatureSignupCountry(state)
    .getOrElse(false) as boolean,
  userGeoData: selectors.auth.getUserGeoData(state) as GeoLocationType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  formValues: SignupFormType
  goals: GoalDataType
  isLoadingR: RemoteDataType<string, undefined>
  language: string
  search: string
  signupCountryEnabled: boolean
  userGeoData: GeoLocationType
}
type StateProps = {
  showForm: boolean
  showState: boolean
}
export type Props = ConnectedProps<typeof connector> & LinkStatePropsType

const enhance = compose(reduxForm<{}, Props>({ form: SIGNUP_FORM }), connector)

export default enhance(SignupContainer) as React.ComponentClass<Props>
