import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { GoalsType } from 'data/goals/types'
import { isNil, prop } from 'ramda'
import { RootState } from 'data/rootReducer'
import React from 'react'
import Register from './template'

class RegisterContainer extends React.PureComponent<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    let location = prop('location', window)
    let hash = prop('hash', location)
    let showWalletFormQuery = !isNil(hash) && hash.includes('showWallet')

    this.state = {
      showForm: false,
      showWalletFormQuery
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
    const { data, password } = this.props
    let busy = data.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false
    })

    const passwordLength = (password && password.length) || 0

    return (
      <Register
        busy={busy}
        onSubmit={this.onSubmit}
        password={password}
        passwordLength={passwordLength}
        showForm={this.state.showForm}
        showWalletFormQuery={this.state.showWalletFormQuery}
        toggleForm={this.toggleForm}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: selectors.auth.getRegistering(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  language: selectors.preferences.getLanguage(state),
  email: formValueSelector('register')(state, 'email'),
  goals: selectors.goals.getGoals(state),
  password: formValueSelector('register')(state, 'password') || ''
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
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
}

type StateType = {
  showForm: boolean
  showWalletFormQuery: boolean
}

export type PropsType = ConnectedProps<typeof connector>

export default connector(RegisterContainer)
