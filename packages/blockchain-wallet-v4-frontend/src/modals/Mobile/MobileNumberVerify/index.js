import { actions, selectors } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import MobileNumberVerify from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'
import PropTypes from 'prop-types'
import React from 'react'

class MobileNumberVerifyContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSubmit () {
    this.props.settingsActions.verifyMobile(this.props.code)
  }

  handleResend () {
    this.props.settingsActions.resendMobile(this.props.mobileNumber)
  }

  handleChange () {
    this.props.modalActions.closeModal()
    this.props.modalActions.showModal('MobileNumberChange')
  }

  render () {
    return (
      <MobileNumberVerify
        {...this.props}
        onSubmit={this.onSubmit}
        handleResend={this.handleResend}
        handleChange={this.handleChange}
      />
    )
  }
}

MobileNumberVerifyContainer.propTypes = {
  mobileNumber: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  code: formValueSelector('mobileNumberVerify')(state, 'code'),
  smsVerified: selectors.core.settings.getSmsVerified(state).getOrElse()
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberVerify'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(MobileNumberVerifyContainer)
