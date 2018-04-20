import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { smsNumber, smsVerified, modalActions } = this.props

    if (!smsVerified && smsNumber) {
      modalActions.showModal('MobileNumberVerify', { mobileNumber: smsNumber })
    } else {
      modalActions.showModal('MobileNumberChange')
    }
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(SettingContainer)
