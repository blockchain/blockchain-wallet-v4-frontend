import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { find, propEq, propOr } from 'ramda'
import { formValueSelector } from 'redux-form'
import React from 'react'

import { ABTestCmdType } from 'blockchain-wallet-v4-frontend/src/data/analytics/types'
import { actions, model, selectors } from 'data'
import { GoalsType } from 'data/goals/types'
import { Remote } from 'blockchain-wallet-v4/src'
import { RemoteDataType, SupportedWalletCurrenciesType } from 'core/types'
import { RootState } from 'data/rootReducer'

import Register from './template'

const { AB_TESTS } = model.analytics

class RegisterContainer extends React.PureComponent<PropsType, StateType> {
  state = {
    showForm: false
  }
  componentDidMount () {
    if (Remote.Success.is(this.props.abTest)) return
    window.addEventListener('message', this.receiveMatomoMessage, false)
    this.props.analyticsActions.createABTest(AB_TESTS.VERIFY_EMAIL)
    // Fallback if a/b test can not be created
    setTimeout(() => {
      if (!Remote.Success.is(this.props.abTest)) {
        const rest = {
          command: 'home',
          from: 'matomo',
          to: 'signup'
        }
        this.props.analyticsActions.createABTestSuccess(
          AB_TESTS.VERIFY_EMAIL,
          rest as ABTestCmdType
        )
      }
    }, 1000)
  }

  receiveMatomoMessage = res => {
    if (res.data.from === 'matomo') {
      const rest = {
        command: res.data.command,
        from: 'matomo',
        to: 'signup'
      }
      this.props.analyticsActions.createABTestSuccess(
        AB_TESTS.VERIFY_EMAIL,
        rest as ABTestCmdType
      )
    }
  }

  onSubmit = () => {
    const { authActions, email, password, language } = this.props
    authActions.register(email, password, language)
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  render () {
    const { data, goals, password, search } = this.props
    let busy = data.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false
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
  search: selectors.router.getSearch(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType),
  abTest: selectors.analytics.selectAbTest(AB_TESTS.VERIFY_EMAIL)(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  abTest: RemoteDataType<string, ABTestCmdType> | undefined
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

export type PropsType = ConnectedProps<typeof connector>

export default connector(RegisterContainer)
