import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { equals, path, prop } from 'ramda'
import * as crypto from 'crypto'

import { actions, selectors } from 'data'
import { transactions } from 'blockchain-wallet-v4/src'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    const { exchangeAccounts } = this.props
    const amount = this.props.amount || 0
    const sourceCoin = exchangeAccounts && exchangeAccounts.source ? exchangeAccounts.source.coin : 'BTC'
    const targetCoin = exchangeAccounts && exchangeAccounts.target ? exchangeAccounts.target.coin : 'ETH'

    this.state = { sourceCoin, targetCoin, amount }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.shapeShiftActions.initShapeShift()
  }

  componentWillReceiveProps (nextProps) {
    const { exchangeAccounts, amount, ethFeeRegular, gasLimit, bitcoinFeeValues } = nextProps

    if (exchangeAccounts) {
      const sourceCoin = path(['source', 'coin'], exchangeAccounts)
      const targetCoin = path(['target', 'coin'], exchangeAccounts)

      if (!equals(this.props.exchangeAccounts, exchangeAccounts)) {
        this.setState({
          sourceCoin,
          targetCoin
        })
      }

      if (!equals(this.props.ethFeeRegular, ethFeeRegular) ||
        !equals(this.props.gasLimit, gasLimit) ||
        (ethFeeRegular && gasLimit)
      ) {
        const ethFee = transactions.ethereum.calculateFee(ethFeeRegular, gasLimit)
        this.setState({ ethFee })
      }

      if (equals(sourceCoin, 'BTC')) {
        const source = prop('source', exchangeAccounts)
        const from = { xpub: source.xpub, index: source.index }
        if (!equals(source, prop('source', this.props.exchangeAccounts))) {
          this.props.bitcoinActions.getUnspent(from)
        }

        if (amount && (!equals(this.props.source, source) ||
          !equals(this.props.amount, amount) ||
          !equals(this.props.bitcoinFeeValues, bitcoinFeeValues))) {
          if (this.timeout) { clearTimeout(this.timeout) }
          this.timeout = setTimeout(() => {
            console.log({ from, amount, fee: bitcoinFeeValues.regular, seed: this.seed })
            this.props.bitcoinActions.getSelection({ from, amount, fee: bitcoinFeeValues.regular, seed: this.seed })
          }, 1000)
        }
      }
    }

    if (amount && !equals(this.props.amount, amount)) {
      this.setState({
        amount
      })
    }
  }

  handleSubmit () {
    this.props.nextStep()
  }

  render () {
    const { exchangeAccounts, etherBalance, bitcoinEffectiveBalance, ...rest } = this.props
    const { ethFee } = this.state
    const effectiveBalance = this.state.sourceCoin === 'ETH'
                              ? (etherBalance - this.state.ethFee > 0
                                ? etherBalance - ethFee
                                : 0)
                              : bitcoinEffectiveBalance

    return (
      <FirstStep
        sourceCoin={this.state.sourceCoin}
        targetCoin={this.state.targetCoin}
        sourceAmount={this.state.amount}
        handleSubmit={this.handleSubmit}
        max={effectiveBalance}
        {...rest} />
    )
  }
}

const mapStateToProps = (state) => ({
  exchangeAccounts: formValueSelector('exchange')(state, 'accounts'),
  amount: formValueSelector('exchange')(state, 'amount'),
  ethFeeRegular: selectors.core.data.ethereum.getFeeRegular(state) || 0,
  gasLimit: selectors.core.data.ethereum.getGasLimit(state) || 0,
  bitcoinFeeValues: selectors.core.data.bitcoin.getFee(state),
  etherBalance: selectors.core.data.ethereum.getBalance(state),
  bitcoinEffectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state) || 0
})

const mapDispatchToProps = (dispatch) => ({
  shapeShiftActions: bindActionCreators(actions.payment.shapeShift, dispatch),
  bitcoinActions: bindActionCreators(actions.payment.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
