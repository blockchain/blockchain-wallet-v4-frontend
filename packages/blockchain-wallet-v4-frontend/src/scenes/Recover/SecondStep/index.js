import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import Recover from './template.js'
import { actions, selectors } from 'data'

class RecoverContainer extends React.PureComponent {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    const { mnemonic, email, password, language } = this.props
    this.props.authActions.restore(mnemonic, email, password, language)
  }

  render () {
    const { data, password, previousStep } = this.props
    const busy = data.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false
    })

    return (
      <Recover
        previousStep={previousStep}
        onSubmit={this.onSubmit}
        busy={busy}
        password={password}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.auth.getRegistering(state),
  email: formValueSelector('recover')(state, 'email'),
  mnemonic: formValueSelector('recover')(state, 'mnemonic'),
  password: formValueSelector('recover')(state, 'password') || '',
  language: selectors.preferences.getLanguage(state)
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoverContainer)
