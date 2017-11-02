import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import { Exchange } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({ active: true })
    this.timeout = setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    const { amount, message, receiveAddress, unit } = this.props
    const satoshis = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: unit, toUnit: 'SAT' }).value
    const btc = Exchange.convertBitcoinToBitcoin({ value: amount, fromUnit: unit, toUnit: 'BTC' }).value
    const link = `https://blockchain.info/payment_request?address=${receiveAddress}&amount=${btc}&message=${message}`

    return <SecondStep {...this.props}
      satoshis={satoshis}
      link={link}
      active={this.state.active}
      onSubmit={this.onSubmit}
    />
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
  const unit = selectors.core.settings.getBtcUnit(state)
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const receiveAddress = extractAddress(to, getReceive)

  return {
    amount,
    message,
    receiveAddress,
    unit
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
