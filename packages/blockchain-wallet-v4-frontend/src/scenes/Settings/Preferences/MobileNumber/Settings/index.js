import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import Settings from './template.js'

class SettingContainer extends Component {
  state = { show2FAWarning: false }

  handleClick = () => {
    const { authType, modalActions, smsNumber, smsVerified } = this.props

    if (!smsVerified && smsNumber) {
      modalActions.showModal('MobileNumberVerify', { mobileNumber: smsNumber })
    } else if (authType === 5) {
      this.setState({ show2FAWarning: true })
    } else {
      modalActions.showModal('MobileNumberChange')
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

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(SettingContainer)
