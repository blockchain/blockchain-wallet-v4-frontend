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
    this.handleLogout = this.handleLogout.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleLogout () {
    this.props.modalActions.clickAutoDisconnectionLogout()
  }

  handleCancel () {
    this.props.modalActions.clickAutoDisconnectionCancel()
  }

  render () {
    return <AutoDisconnection {...this.props} handleLogout={this.handleLogout} handleCancel={this.handleCancel} />
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
