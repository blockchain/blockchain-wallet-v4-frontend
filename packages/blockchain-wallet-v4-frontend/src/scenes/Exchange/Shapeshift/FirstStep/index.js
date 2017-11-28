import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { assoc, equals, path, prop } from 'ramda'
import * as crypto from 'crypto'

import { actions, selectors } from 'data'
import { transactions } from 'blockchain-wallet-v4/src'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    const { accounts } = this.props
    const amount = this.props.amount || 0
    const sourceCoin = path(['source', 'coin'], accounts) || 'BTC'
    const targetCoin = path(['target', 'coin'], accounts) || 'ETH'

    this.state = { sourceCoin, targetCoin, amount }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('exchange', this.props.initialValues)
    this.props.shapeShiftActions.initShapeShift()
  }

  componentWillReceiveProps (nextProps) {
    const { accounts, amount, ethFeeRegular, gasLimit, bitcoinFeeValues } = nextProps

    if (accounts) {
      const sourceCoin = path(['source', 'coin'], accounts)
      const targetCoin = path(['target', 'coin'], accounts)

      if (!equals(this.props.accounts, accounts)) {
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
        const source = prop('source', accounts)
        const from = { xpub: source.xpub, index: source.index }
        if (!equals(source, prop('source', this.props.accounts))) {
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
    const { accounts, etherBalance, bitcoinEffectiveBalance, ...rest } = this.props
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

const mapStateToProps = (state) => {
  const source = selectors.core.wallet.getDefaultAccount(state)
  const target = selectors.core.kvStore.ethereum.getDefaultAccount(state)
  const initialValues = {
    accounts: {
      source: assoc('coin', 'BTC', source),
      target: assoc('coin', 'ETH', target)
    }
  }

  return {
    initialValues,
    accounts: formValueSelector('exchange')(state, 'accounts'),
    amount: formValueSelector('exchange')(state, 'amount'),
    ethFeeRegular: selectors.core.data.ethereum.getFeeRegular(state) || 0,
    gasLimit: selectors.core.data.ethereum.getGasLimit(state) || 0,
    bitcoinFeeValues: selectors.core.data.bitcoin.getFee(state),
    etherBalance: selectors.core.data.ethereum.getBalance(state),
    bitcoinEffectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state) || 0
  }
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  shapeShiftActions: bindActionCreators(actions.payment.shapeShift, dispatch),
  bitcoinActions: bindActionCreators(actions.payment.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
