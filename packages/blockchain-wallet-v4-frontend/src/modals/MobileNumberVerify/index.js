import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import MobileNumberVerify from './template.js'

class MobileNumberVerifyContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleValidate = this.handleValidate.bind(this)
    this.handleResend = this.handleResend.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount () {
    this.props.modalActions.clickMobileNumberVerifyResend(this.props.mobileNumber)
  }

  handleResend () {
    this.props.modalActions.clickMobileNumberVerifyResend(this.props.mobileNumber)
  }

  handleValidate () {
    this.props.modalActions.clickMobileNumberVerifyValidate()
  }

  handleChange () {
    this.props.modalActions.clickMobileNumberVerifyChange()
  }

  handleCancel () {
    this.props.modalActions.clickMobileNumberVerifyCancel()
  }

  render () {
    return (
      <MobileNumberVerify
        {...this.props}
        handleValidate={this.handleValidate}
        handleResend={this.handleResend}
        handleChange={this.handleChange}
        handleCancel={this.handleCancel}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('MobileNumberVerify'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(MobileNumberVerifyContainer)
