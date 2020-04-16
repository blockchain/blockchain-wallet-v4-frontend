import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'
import Register from './template'

type DispatchPropTypes = {
  alertActions: typeof actions.alerts
  analyticsActions: typeof actions.analytics
  authActions: typeof actions.auth
}

type MapStatePropsType = {
  data: any
  domainsR: any
  email: string
  goals: Array<any>
  language: string
  password: string
}

export type PropsType = MapStatePropsType & DispatchPropTypes

type StateType = {
  showForm: boolean
}

class RegisterContainer extends React.PureComponent<PropsType, StateType> {
  state = {
    showForm: false
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
        toggleForm={this.toggleForm}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterContainer)
