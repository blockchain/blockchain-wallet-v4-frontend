import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'
import Register from './template'

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
        busy={busy}
        onSubmit={this.onSubmit}
        password={password}
        passwordLength={passwordLength}
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

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterContainer)
