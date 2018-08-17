import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keys } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'

import VerifyMobile from './template'

const { SMS_STEPS } = model.components.identityVerification

class VerifyMobileContainer extends React.PureComponent {
  componentDidMount () {
    const { actions } = this.props
    actions.updateSmsStep()
  }

  render () {
    const {
      activeField,
      smsNumber,
      step,
      mobileVerifiedError,
      countryCode,
      actions,
      handleSubmit
    } = this.props

    return (
      <VerifyMobile
        initialValues={{ smsNumber }}
        smsNumber={smsNumber}
        activeField={activeField}
        step={step}
        countryCode={countryCode}
        mobileVerifiedError={mobileVerifiedError}
        editSmsNumber={actions.setSmsStep.bind(null, SMS_STEPS.edit)}
        updateSmsNumber={actions.updateSmsNumber}
        resendCode={actions.resendSmsCode}
        onSubmit={handleSubmit}
      />
    )
  }
}

VerifyMobileContainer.propTypes = {
  smsNumber: PropTypes.string.isRequired,
  step: PropTypes.oneOf(keys(SMS_STEPS)).isRequired,
  mobileVerifiedError: PropTypes.string,
  countryCode: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(VerifyMobileContainer)
