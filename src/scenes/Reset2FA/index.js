import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import { actions } from 'data'

class Reset2FAContainer extends React.Component {
  constructor () {
    super()
    this.state = { step: 1, timestamp: '', guid: '', email: '', newEmail: '', secretPhrase: '' }
    this.handleClickStep1 = this.handleClickStep1.bind(this)
    this.handleClickStep2 = this.handleClickStep2.bind(this)
    this.handleClickStep3 = this.handleClickStep3.bind(this)
    this.handleGoBackStep2 = this.handleGoBackStep2.bind(this)
    this.handleGoBackStep3 = this.handleGoBackStep3.bind(this)
  }

  handleClickStep1 (event) {
    event.preventDefault()
    this.setState({ step: 2, guid: this.props.guid, email: this.props.email })
  }

  handleClickStep2 (event) {
    event.preventDefault()
    this.setState({ step: 3, timestamp: new Date().getTime(), newEmail: this.props.newEmail, secretPhrase: this.props.secretPhrase })
  }

  handleClickStep3 (event) {
    event.preventDefault()
    this.props.alertActions.displaySuccess('Reset 2FA successful')
  }

  handleGoBackStep2 (event) {
    event.preventDefault()
    this.setState({ step: 1, guid: '', email: '' })
  }

  handleGoBackStep3 (event) {
    event.preventDefault()
    this.setState({ step: 2, newEmail: '', secretPhrase: '' })
  }

  render () {
    switch (this.state.step) {
      case 2: return <SecondStep handleClickStep2={this.handleClickStep2} handleGoBackStep2={this.handleGoBackStep2} />
      case 3: return <ThirdStep handleClickStep3={this.handleClickStep3} handleGoBackStep3={this.handleGoBackStep3} />
      default: return <FirstStep handleClickStep1={this.handleClickStep1} />
    }
  }
}

function matchStateToProps (state) {
  const selector1 = formValueSelector('reset2FAForm')
  const selector2 = formValueSelector('reset2FAForm2')
  const selector3 = formValueSelector('reset2FAForm3')
  return {
    guid: selector1(state, 'guid'),
    email: selector1(state, 'email'),
    newEmail: selector2(state, 'newEmail'),
    secretPhrase: selector2(state, 'secretPhrase'),
    message: selector3(state, 'message'),
    captcha: selector3(state, 'captcha')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

export default connect(matchStateToProps, mapDispatchToProps)(Reset2FAContainer)
