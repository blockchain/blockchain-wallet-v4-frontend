import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    // this.props.paymentActions.sendBitcoin(this.props.selection)
  }

  render () {
    return <SecondStep {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const message = formValueSelector('sendBitcoin')(state, 'message')
  const wei = 100
  const fee = 0.000411

  return {
    fee,
    message,
    to,
    wei
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
