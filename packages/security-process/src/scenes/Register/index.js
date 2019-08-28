import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Register from './template'
import { actions, selectors } from 'data'

class RegisterContainer extends React.PureComponent {
  onSubmit = () => {
    const { email, password, language } = this.props
    this.props.authActions.register(email, password, language)
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
        onSubmit={this.onSubmit}
        busy={busy}
        password={password}
        passwordLength={passwordLength}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.auth.getRegistering(state),
  language: selectors.preferences.getLanguage(state),
  email: formValueSelector('register')(state, 'email'),
  goals: selectors.goals.getGoals(state),
  password: formValueSelector('register')(state, 'password') || ''
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterContainer)
