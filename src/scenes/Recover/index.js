import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { wizardForm } from 'components/providers/FormProvider'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { actions } from 'data'

class ReminderContainer extends React.Component {
  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 0: return <FirstStep {...rest} />
      case 1: return <SecondStep {...rest} />
      default: return <FirstStep {...rest} />
    }
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('recoverForm')
  return {
    email: selector(state, 'email'),
    password: selector(state, 'password'),
    confirmationPassword: selector(state, 'confirmationPassword')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

const enhance = compose(
  wizardForm('recoverForm', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ReminderContainer)
