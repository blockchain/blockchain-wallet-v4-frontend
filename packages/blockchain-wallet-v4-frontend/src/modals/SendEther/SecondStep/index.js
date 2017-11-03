import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { Exchange } from 'blockchain-wallet-v4/src'

import { actions } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
  }

  render () {
    const { amount, ...rest } = this.props
    const amountWei = Exchange.convertEtherToEther({ value: amount, fromUnit: 'ETH', toUnit: 'WEI' }).value

    return <SecondStep {...rest} amount={amountWei} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const to = formValueSelector('sendEther')(state, 'to')
  const message = formValueSelector('sendEther')(state, 'message')
  const amount = formValueSelector('sendEther')(state, 'amount')
  const fee = formValueSelector('sendEther')(state, 'fee')

  return {
    fee,
    message,
    to,
    amount
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
