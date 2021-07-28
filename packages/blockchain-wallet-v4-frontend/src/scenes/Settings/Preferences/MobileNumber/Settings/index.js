import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Settings from './template.js'

class SettingContainer extends Component {
  constructor(props) {
    super(props)

    this.state = { show2FAWarning: false }
  }

  handleClick = () => {
    const { authType, modalActions, smsNumber, smsVerified } = this.props

    if (!smsVerified && smsNumber) {
      modalActions.showModal('MOBILE_NUMBER_VERIFY_MODAL', { mobileNumber: smsNumber })
    } else if (authType === 5) {
      this.setState({ show2FAWarning: true })
    } else if (smsVerified === 1) {
      modalActions.showModal('MOBILE_NUMBER_CHANGE_MODAL')
    } else if (smsNumber) {
      modalActions.showModal('MOBILE_NUMBER_VERIFY_MODAL', {
        mobileNumber: smsNumber
      })
    } else {
      modalActions.showModal('MOBILE_NUMBER_ADD_MODAL')
    }
  }

  render() {
    const { modalActions, smsNumber, smsVerified } = this.props

    return (
      <Settings
        smsNumber={smsNumber}
        smsVerified={smsVerified}
        handleClick={this.handleClick}
        modalActions={modalActions}
        showWarning={this.state.show2FAWarning}
        resetWarning={() => this.setState({ show2FAWarning: false })}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(SettingContainer)
