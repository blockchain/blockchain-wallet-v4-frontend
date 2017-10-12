import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
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

const mapStateToProps = (state) => ({
  smsNumber: selectors.core.settings.getSmsNumber(state),
  smsVerified: selectors.core.settings.getSmsVerified(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
