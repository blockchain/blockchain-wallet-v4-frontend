import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { convertBaseCoinToCoin } from 'services/ConversionService'
import { actions } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleClick () {
    this.setState({ active: true })
    this.timeout = setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    const { unit, receiveAddress, amount, message } = this.props
    const btcAmount = convertBaseCoinToCoin(unit, amount).getOrElse({value: ''})
    const link = `https://blockchain.info/payment_request?address=${receiveAddress}&amount=${btcAmount.value}&message=${message}`

    return <SecondStep {...this.props} satoshis={satoshis.amount} link={link} active={this.state.active} handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(SecondStepContainer)
