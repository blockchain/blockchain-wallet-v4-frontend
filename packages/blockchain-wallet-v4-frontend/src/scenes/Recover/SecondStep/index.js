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
    const network = settings.NETWORK_BITCOIN
    this.props.authActions.restore(mnemonic, email, password, network)
  }

  render () {
    const { previousStep } = this.props

    return (
      <Recover previousStep={previousStep} onSubmit={this.onSubmit} />
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
