import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileNumberVerify from './template.js'

class MobileNumberVerifyContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleChangeMobileNumber = this.handleChangeMobileNumber.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.handleVerify = this.handleVerify.bind(this)
  }

  handleResend () {
    const { guid, sharedKey, mobileNumber } = this.props
    this.props.settingsActions.updateMobile(guid, sharedKey, mobileNumber)
  }

  handleVerify () {
    const { guid, sharedKey, code } = this.props
    this.props.settingsActions.verifyMobile(guid, sharedKey, code)
    this.props.modalActions.closeModal()
  }

  handleChangeMobileNumber () {
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('ChangeMobileNumber')
  }

  render () {
    return (
      <MobileNumberVerify
        {...this.props}
        handleChangeMobileNumber={this.handleChangeMobileNumber}
        handleResend={this.handleResend}
        handleVerify={this.handleVerify}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  code: formValueSelector('mobileNumberVerify')(state, 'code'),
  payload: PropTypes.shape({
    mobileNumber: PropTypes.string.isRequired
  }).isRequired
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberVerify'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(MobileNumberVerifyContainer)
