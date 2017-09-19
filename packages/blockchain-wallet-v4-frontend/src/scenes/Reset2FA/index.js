import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import { actions } from 'data'

class Reset2FAContainer extends React.Component {
  constructor () {
    super()
    this.state = { timestamp: new Date().getTime() }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    // this.setState({ timestamp: new Date().getTime() })
    this.props.alertActions.displaySuccess('Success !')
  }

  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep {...rest} />
      case 2: return <SecondStep {...rest} />
      case 3: return <ThirdStep {...rest} handleSubmit={this.handleSubmit} timestamp={this.state.timestamp} />
      default: return <FirstStep {...rest} />
    }
  }
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('reset2FAForm')
  return {
    guid: selector(state, 'guid'),
    email: selector(state, 'email'),
    newEmail: selector(state, 'newEmail'),
    secretPhrase: selector(state, 'secretPhrase'),
    message: selector(state, 'message'),
    captcha: selector(state, 'captcha')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(actions.auth, dispatch),
    alertActions: bindActionCreators(actions.alerts, dispatch),
    coreActions: bindActionCreators(actions.core.wallet, dispatch)
  }
}

const enhance = compose(
  wizardProvider('reset2FA', 3),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(Reset2FAContainer)
