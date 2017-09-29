import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { push } from 'connected-react-router'

import settings from 'config'
import { convertUnitToSatoshis } from 'services/ConversionService'
import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    const { selection } = this.props
    this.props.modalActions.clickSendBitcoinSend(selection)
  }

  render () {
    return <SecondStep {...this.props} onSubmit={this.onSubmit} />
  }
}

const extractAddress = (value, selectorFunction) =>
  value
    ? value.address
      ? value.address
      : selectorFunction(value.index)
    : undefined

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const getChange = index => selectors.core.common.getNextAvailableChangeAddress(settings.NETWORK, index, state)

  const unit = selectors.core.settings.getBtcCurrency(state)
  const selection = selectors.core.payment.getSelection(state)

  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  const amount = formValueSelector('sendBitcoin')(state, 'amount')
  const message = formValueSelector('sendBitcoin')(state, 'message')
  const fee = formValueSelector('sendBitcoin')(state, 'fee')

  const satoshis = convertUnitToSatoshis(amount, unit).value
  const fromAddress = extractAddress(from, getChange)
  const toAddress = to2 || extractAddress(to, getReceive)

  return {
    fee,
    message,
    fromAddress,
    toAddress,
    satoshis,
    selection
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  routerActions: bindActionCreators({ push }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
