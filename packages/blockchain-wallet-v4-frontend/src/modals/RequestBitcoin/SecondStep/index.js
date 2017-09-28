import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import { convertUnitToSatoshis, convertSatoshisToUnit } from 'services/ConversionService'
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
    const { receiveAddress, satoshis, btc, message } = this.props
    const link = `https://blockchain.info/payment_request?address=${receiveAddress}&amount=${btc}&message=${message}`
    console.log(this.props)

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
  const unit = selectors.core.settings.getBtcCurrency(state)
  const amount = formValueSelector('requestBitcoin')(state, 'amount')
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const message = formValueSelector('requestBitcoin')(state, 'message')
  const receiveAddress = extractAddress(to, getReceive)
  const satoshis = convertUnitToSatoshis(amount, unit).value
  const btc = convertSatoshisToUnit(satoshis, 'BTC').value

  return {
    satoshis,
    btc,
    message,
    receiveAddress
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
