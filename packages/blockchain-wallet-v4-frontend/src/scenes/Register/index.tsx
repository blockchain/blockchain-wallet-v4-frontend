import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, propEq, propOr } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import { formValueSelector } from 'redux-form'

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
    const { authActions, country, email, language, password, state } = this.props
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
    const countryIsUS = country === 'US'
    this.setState({ showState: countryIsUS })
  }

  render() {
    const { data, goals, password, search, userGeoData } = this.props
    const busy = data.cata({
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false,
      Success: () => false
    })

    const passwordLength = (password && password.length) || 0
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
        busy={busy || !userGeoData}
        isLinkAccountGoal={isLinkAccountGoal}
        isSimpleBuyGoal={isSimpleBuyGoal}
        initialValues={signupInitialValues}
        onSubmit={this.onSubmit}
        password={password}
        passwordLength={passwordLength}
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
  country: formValueSelector(REGISTER_FORM)(state, 'country'),
  data: selectors.auth.getRegistering(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  email: formValueSelector(REGISTER_FORM)(state, 'email'),
  goals: selectors.goals.getGoals(state),
  language: selectors.preferences.getLanguage(state),
  password: formValueSelector(REGISTER_FORM)(state, 'password') || '',
  search: selectors.router.getSearch(state) as string,
  state: formValueSelector(REGISTER_FORM)(state, 'state'),
  userGeoData: selectors.auth.getUserGeoData(state) as GeoLocation
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  country: string
  data: any
  domainsR: any
  email: string
  goals: Array<{ data: any; id: string; name: GoalsType }>
  language: string
  password: string
  search: string
  state: string
  userGeoData: GeoLocation
}

type StateType = {
  showForm: boolean
  showState: boolean
}

export type PropsType = ConnectedProps<typeof connector> & LinkStatePropsType

export default connector(RegisterContainer)
