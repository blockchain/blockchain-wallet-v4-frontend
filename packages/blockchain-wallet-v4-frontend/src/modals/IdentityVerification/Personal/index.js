import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { equals, keys } from 'ramda'

import {
  PERSONAL_STEPS,
  EMAIL_STEPS,
  SMS_STEPS
} from 'data/components/identityVerification/model'
import { actions } from 'data'
import { getData } from './selectors'
import Personal from './template'
import EditEmail from './EditEmail'
import EditSmsNumber from './EditSmsNumber'

class PersonalContainer extends React.PureComponent {
  componentDidMount () {
    const { personalData, actions } = this.props
    actions.updatePersonalStep(personalData)
  }

  componentDidUpdate (prevProps) {
    const { personalData, actions } = this.props
    if (!equals(personalData, prevProps.personalData)) {
      actions.updatePersonalStep(personalData)
      actions.setFormBusy(false)
    }
  }

  render () {
    const {
      personalData,
      step,
      formBusy,
      countryCode,
      actions,
      handleSubmit
    } = this.props
    const { email, smsNumber } = personalData

    if (step === PERSONAL_STEPS.email) {
      return (
        <EditEmail
          initialValues={{ email }}
          email={email}
          editEmail={actions.setEmailStep.bind(null, EMAIL_STEPS.edit)}
          updateEmail={actions.updateEmail}
          verifyEmail={actions.verifyEmail}
          resendCode={actions.resendEmailCode}
          formBusy={formBusy}
        />
      )
    }

    if (step === PERSONAL_STEPS.smsNumber) {
      return (
        <EditSmsNumber
          initialValues={{ smsNumber }}
          smsNumber={smsNumber}
          editSmsNumber={actions.setSmsStep.bind(null, SMS_STEPS.edit)}
          updateSmsNumber={actions.updateSmsNumber}
          verifySmsNumber={actions.verifySmsNumber}
          resendCode={actions.resendSmsCode}
          formBusy={formBusy}
        />
      )
    }

    if (step === PERSONAL_STEPS.personal) {
      return (
        <Personal
          {...personalData}
          onSubmit={handleSubmit}
          initialValues={{ email, smsNumber }}
          countryCode={countryCode}
          editEmail={actions.setPersonalStep.bind(null, PERSONAL_STEPS.email)}
          editSms={actions.setPersonalStep.bind(null, PERSONAL_STEPS.smsNumber)}
          formBusy={formBusy}
        />
      )
    }

    return ''
  }
}

PersonalContainer.propTypes = {
  personalData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    smsNumber: PropTypes.string.isRequired,
    emailVerified: PropTypes.number.isRequired,
    smsVerified: PropTypes.number.isRequired
  }),
  countryCode: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  step: PropTypes.oneOf(keys(PERSONAL_STEPS)).isRequired,
  formBusy: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(PersonalContainer)
