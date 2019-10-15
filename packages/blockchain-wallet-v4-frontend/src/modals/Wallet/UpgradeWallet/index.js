import React from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import UpgradeWallet from './template.js'

class UpgradeContainer extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    this.props.modalActions.closeModal()
    this.props.authActions.upgradeWallet(this.props.version)
  }

  render () {
    return <UpgradeWallet {...this.props} handleSubmit={this.handleSubmit} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

const enhance = compose(
  modalEnhancer('UpgradeWallet'),
  reduxForm({ form: 'upgradeWallet' }),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(UpgradeContainer)
