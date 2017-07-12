import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import withWizard from 'components/providers/WizardForm'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { actions } from 'data'

class ReminderContainer extends React.Component {
  render () {
    const { step, next, previous } = this.props

    switch (step) {
      case 0: return <FirstStep handleClick={next} />
      case 1: return <SecondStep handleClick={next} handleGoBack={previous} />
      default: return <FirstStep handleClick={next} />
    }
  }
}

const matchStateToProps = (state) => {
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
  withWizard({ totalSteps: 3, formName: 'recoverForm' }),
  connect(matchStateToProps, mapDispatchToProps)
)

export default enhance(ReminderContainer)
