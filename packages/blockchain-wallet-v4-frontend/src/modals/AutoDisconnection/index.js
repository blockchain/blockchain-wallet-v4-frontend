import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import AutoDisconnection from './template.js'

class AutoDisconnectionContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  onSubmit () {
    this.props.authActions.logout()
    this.props.modalActions.closeModal()
  }

  handleCancel () {
    this.props.authActions.logoutResetTimer()
    this.props.modalActions.closeModal()
  }

  render () {
    return <AutoDisconnection {...this.props} onSubmit={this.onSubmit} handleCancel={this.handleCancel} />
  }
}

AutoDisconnectionContainer.defaultProps = {
  duration: 0
}

AutoDisconnectionContainer.propTypes = {
  duration: PropTypes.number
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('AutoDisconnection'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(AutoDisconnectionContainer)
