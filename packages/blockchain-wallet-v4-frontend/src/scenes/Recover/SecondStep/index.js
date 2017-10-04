import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import Recover from './template.js'
import { actions } from 'data'

class RecoverContainer extends React.Component {
  constructor () {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { mnemonic, email, password } = this.props
    const network = settings.NETWORK
    this.props.alertActions.displayInfo('Restoring wallet...')
    this.props.walletActions.restoreWallet(mnemonic, email, password, network)
  }

  render () {
    return (
      <Recover onSubmit={this.onSubmit} />
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
  walletActions: bindActionCreators(actions.core.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(RecoverContainer)
