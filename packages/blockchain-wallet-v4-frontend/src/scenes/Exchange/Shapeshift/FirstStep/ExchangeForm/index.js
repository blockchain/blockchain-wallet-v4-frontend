import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals, path } from 'ramda'
import * as crypto from 'crypto'

import { actions } from 'data'
// import { initializeForm } from './services'
import ExchangeForm from './template'

class ExchangeFormContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // componentWillReceiveProps (nextProps) {
  //   // Initialize form
  //   // initializeForm(this.props, nextProps)
  //   // Update target/source if source/target has changed
  //   // changeCoin(this.props, nextProps)
  // }

  // componentWillReceiveProps (nextProps) {
  //   const { accounts, amount, ethFeeRegular, gasLimit, bitcoinFeeValues } = nextProps

  //   if (accounts) {
  //     if (!equals(this.props.ethFeeRegular, ethFeeRegular) ||
  //       !equals(this.props.gasLimit, gasLimit) ||
  //       (ethFeeRegular && gasLimit)
  //     ) {
  //       // const ethFee = transactions.ethereum.calculateFee(ethFeeRegular, gasLimit)
  //       // this.setState({ ethFee })
  //     }

  //     if (equals(sourceCoin, 'BTC')) {
  //       const source = prop('source', accounts)
  //       const from = { xpub: source.xpub, index: source.index }
  //       if (!equals(source, prop('source', this.props.accounts))) {
  //         // this.props.sendBitcoinActions.getUnspent(from)
  //       }

  //       if (amount && (!equals(this.props.source, source) ||
  //         !equals(this.props.amount, amount) ||
  //         !equals(this.props.bitcoinFeeValues, bitcoinFeeValues))) {
  //         if (this.timeout) { clearTimeout(this.timeout) }
  //         this.timeout = setTimeout(() => {
  //           // this.props.sendBitcoinActions.getSelection({ from, amount, fee: bitcoinFeeValues.regular, seed: this.seed })
  //         }, 1000)
  //       }
  //     }
  //   }

  handleSubmit () {
    console.log('handleSubmit')
    console.log(this.props)
    this.props.nextStep()
  }

  render () {
    console.log('ExchangeForm', this.props)
    // const { accounts, etherBalance, bitcoinEffectiveBalance, ...rest } = this.props
    // const { ethFee } = this.state
    // const effectiveBalance = this.state.sourceCoin === 'ETH'
    //                           ? (etherBalance - this.state.ethFee > 0
    //                             ? etherBalance - ethFee
    //                             : 0)
    //                           : bitcoinEffectiveBalance
    // console.log('data', this.props.data)
    // const { sourceCoin, targetCoin, amount } = this.state
    return <ExchangeForm {...this.props} handleSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const sourceCoin = path(['source', 'coin'], accounts)
  const targetCoin = path(['target', 'coin'], accounts)

  return {
    accounts,
    amount,
    sourceCoin,
    targetCoin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeFormContainer)
