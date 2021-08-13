import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, propEq, propOr } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import { GoalsType } from 'data/goals/types'
import { RootState } from 'data/rootReducer'

import { GeoLocation, REGISTER_FORM, SignupInitValues } from './model'
import Register from './template'

class RegisterContainer extends React.PureComponent<PropsType, StateType> {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      showState: false
    }
  }

  componentDidMount() {
    this.props.authActions.getUserGeoLocation()
  }

  onSubmit = () => {
    const { authActions, formValues, language } = this.props
    const { country, email, password, state } = formValues
    authActions.register(email, password, language, country, state)
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  onCountryChange = (e: React.SyntheticEvent, value: string) => {
    this.setDefaultCountry(value)
    this.props.formActions.clearFields(REGISTER_FORM, false, false, 'state')
  }

  setDefaultCountry = (country: string) => {
    this.setState({ showState: country === 'US' })
  }

  render() {
    const { data, goals, search, userGeoData } = this.props
    const isFormSubmitting = Remote.Loading.is(data)
    const showWalletFormQuery = search.includes('showWallet')
    const isLinkAccountGoal = !!find(propEq('name', 'linkAccount'), goals)
    const isSimpleBuyGoal = !!find(propEq('name', 'simpleBuy'), goals)
    const dataGoal = find(propEq('name', 'simpleBuy'), goals)
    const goalData = propOr({}, 'data', dataGoal)
    const email = propOr('', 'email', goalData)
    const signupInitialValues = email ? ({ email } as SignupInitValues) : ({} as SignupInitValues)
    if (userGeoData && userGeoData.countryCode) {
      signupInitialValues.country = userGeoData.countryCode
    }

    return (
      <Register
        isFormSubmitting={isFormSubmitting || !userGeoData}
        isLinkAccountGoal={isLinkAccountGoal}
        isSimpleBuyGoal={isSimpleBuyGoal}
        initialValues={signupInitialValues}
        onSubmit={this.onSubmit}
        showForm={this.state.showForm || showWalletFormQuery}
        toggleForm={this.toggleForm}
        onCountrySelect={this.onCountryChange}
        showState={this.state.showState}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: selectors.auth.getRegistering(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  formValues: selectors.form.getFormValues(REGISTER_FORM)(state) as RegisterFormType,
  goals: selectors.goals.getGoals(state),
  language: selectors.preferences.getLanguage(state),
  search: selectors.router.getSearch(state) as string,
  userGeoData: selectors.auth.getUserGeoData(state) as GeoLocation
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type RegisterFormType = {
  country: string
  email: string
  password: string
  state: string
}
type LinkStatePropsType = {
  data: any
  domainsR: any
  formValues: RegisterFormType
  goals: Array<{
    data: any
    id: string
    name: GoalsType
  }>
  language: string
  search: string
  userGeoData: GeoLocation
}

type StateType = {
  showForm: boolean
  showState: boolean
}

export type PropsType = ConnectedProps<typeof connector> & LinkStatePropsType

export default connector(RegisterContainer)
