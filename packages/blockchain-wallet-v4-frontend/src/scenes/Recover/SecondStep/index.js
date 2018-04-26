import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import Recover from './template.js'
import { actions } from 'data'

class RecoverContainer extends React.PureComponent {
  constructor () {
    super()
    this.state = { busy: false }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({ busy: true })
    const network = settings.NETWORK_BITCOIN
    const { mnemonic, email, password } = this.props
    this.props.authActions.restore(mnemonic, email, password, network)
  }

  render () {
    const { busy } = this.state
    const { previousStep } = this.props

    return (
      <Recover previousStep={previousStep} onSubmit={this.onSubmit} busy={busy} />
    )
  }
}

const mapStateToProps = (state) => ({
  mnemonic: formValueSelector('recover')(state, 'mnemonic'),
  email: formValueSelector('recover')(state, 'email'),
  password: formValueSelector('recover')(state, 'password')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RecoverContainer)
