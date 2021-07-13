import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, propEq, propOr } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import { formValueSelector } from 'redux-form'

import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { GoalsType } from 'data/goals/types'
import { RootState } from 'data/rootReducer'

import Register from './template'

class RegisterContainer extends React.PureComponent<PropsType, StateType> {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false
    }
  }

  onSubmit = () => {
    const { authActions, email, language, password } = this.props
    authActions.register(email, password, language)
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  render() {
    const { data, goals, password, search } = this.props
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
    const signupInitialValues = email ? { email } : {}

    return (
      <Register
        busy={busy}
        isLinkAccountGoal={isLinkAccountGoal}
        isSimpleBuyGoal={isSimpleBuyGoal}
        initialValues={signupInitialValues}
        onSubmit={this.onSubmit}
        password={password}
        passwordLength={passwordLength}
        showForm={this.state.showForm || showWalletFormQuery}
        toggleForm={this.toggleForm}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: selectors.auth.getRegistering(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  email: formValueSelector('register')(state, 'email'),
  goals: selectors.goals.getGoals(state),
  language: selectors.preferences.getLanguage(state),
  password: formValueSelector('register')(state, 'password') || '',
  search: selectors.router.getSearch(state) as string,
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  data: any
  domainsR: any
  email: string
  goals: Array<{ data: any; id: string; name: GoalsType }>
  language: string
  password: string
  search: string
  supportedCoins: SupportedWalletCurrenciesType
}

type StateType = {
  showForm: boolean
}

export type PropsType = ConnectedProps<typeof connector> & LinkStatePropsType

export default connector(RegisterContainer)
