import React from 'react'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { bindActionCreators } from 'redux'

import { convertFromUnit, convertToUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ active: true })
    setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    const { network, unit, nextAddress, amount, message } = this.props
    const satoshis = convertFromUnit(network, amount, unit).getOrElse({ amount: 0 })
    const bitcoins = convertToUnit(network, satoshis.amount, 'BTC').getOrElse({ amount: 0 })
    const link = `https://blockchain.info/payment_request?address=${nextAddress}&amount=${bitcoins.amount}&message=${message}`

    return <SecondStep {...this.props} satoshis={satoshis.amount} link={link} active={this.state.active} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('requestBitcoin')
  return {
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
    amount: selector(state, 'amount'),
    message: selector(state, 'message')
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
