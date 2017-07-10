import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import { actions } from 'data'

class ReminderContainer extends React.Component {
  constructor () {
    super()
    this.state = { step: 1 }
    this.handleClickStep1 = this.handleClickStep1.bind(this)
    this.handleClickStep2 = this.handleClickStep2.bind(this)
    this.handleGoBackStep2 = this.handleGoBackStep2.bind(this)
  }

  handleClickStep1 (event) {
    this.setState({ step: 2 })
  }

  handleClickStep2 (event) {
    event.preventDefault()
    this.props.alertActions.displaySuccess('Recover wallet successful ' + this.props.email)
  }

  handleGoBackStep2 (event) {
    event.preventDefault()
    this.setState({ step: 1 })
  }

  render () {
    switch (this.state.step) {
      case 2: return <SecondStep handleClickStep2={this.handleClickStep2} handleGoBackStep2={this.handleGoBackStep2} />
      default: return <FirstStep handleClickStep1={this.handleClickStep1} />
    }
  }
}

function matchStateToProps (state) {
  const selector = formValueSelector('recoverForm2')
  return {
    email: selector(state, 'email'),
    password: selector(state, 'password'),
    confirmationPassword: selector(state, 'confirmationPassword')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(matchStateToProps, mapDispatchToProps)(ReminderContainer)
