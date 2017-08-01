import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'components/providers/modalEnhancer'
import AutoDisconnection from './template.js'

class AutoDisconnectionContainer extends React.Component {
  constructor (props) {
    super(props)
    this.autoLogout = this.autoLogout.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.timer = 10
    this.counter = this.timer
    this.interval = setInterval(this.autoLogout, 1000)
  }

  autoLogout () {
    if (this.counter === 0) {
      clearInterval(this.interval)
      this.props.authActions.logoutStart()
      this.props.modalActions.closeModal()
    }
    this.counter--
  }

  handleClick () {
    clearInterval(this.interval)
    this.props.authActions.logoutStart()
    this.props.modalActions.closeModal()
  }

  handleCancel () {
    clearInterval(this.interval)
    this.props.authActions.logoutStartTimer()
    this.props.modalActions.closeModal()
  }

  render () {
    return <AutoDisconnection {...this.props} handleClick={this.handleClick} handleCancel={this.handleCancel} />
  }
}

AutoDisconnectionContainer.defaultProps = {
  show: false,
  closeButton: false,
  duration: 0
}

AutoDisconnectionContainer.propTypes = {
  show: PropTypes.bool.isRequired,
  duration: PropTypes.number
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

let enhance = compose(
  modalEnhancer('AutoDisconnection'),
  connect(void 0, mapDispatchToProps)
)

export default enhance(AutoDisconnectionContainer)
