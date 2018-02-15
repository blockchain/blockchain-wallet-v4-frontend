import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as crypto from 'crypto'

import { getData } from './selectors'
import { actions } from 'data'
import { initializeForm, changeSource, changeTarget } from './services'
// import FirstStep from './template.js'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')

    this.state = { sourceCoin: 'BTC', targetCoin: 'ETH' }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSwap = this.handleSwap.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    // Initialize form
    initializeForm(this.props, nextProps)
    // Update target if source changed
    changeSource(this.props, nextProps)
    // Update source if target changed
    changeTarget(this.props, nextProps)
    // Swap coins if needed
    console.log('componentWillUpdate', nextState)
    // swapCoin(this.props, nextProps, nextState.sourceCoin, nextState.targetCoin)
  }

  // componentWillReceiveProps (nextProps) {
  //   const { accounts, amount, ethFeeRegular, gasLimit, bitcoinFeeValues } = nextProps

  //   if (accounts) {
  //     const sourceCoin = path(['source', 'coin'], accounts)
  //     const targetCoin = path(['target', 'coin'], accounts)

  //     if (!equals(this.props.accounts, accounts)) {
  //       this.setState({
  //         sourceCoin,
  //         targetCoin
  //       })
  //     }

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

  //   if (amount && !equals(this.props.amount, amount)) {
  //     this.setState({
  //       amount
  //     })
  //   }
  // }

  handleSubmit () {
    this.props.nextStep()
  }

  handleSwap () {
    this.setState({ sourceCoin: this.state.targetCoin, targetCoin: this.state.sourceCoin })
  }

  render () {
    // const { accounts, etherBalance, bitcoinEffectiveBalance, ...rest } = this.props
    // const { ethFee } = this.state
    // const effectiveBalance = this.state.sourceCoin === 'ETH'
    //                           ? (etherBalance - this.state.ethFee > 0
    //                             ? etherBalance - ethFee
    //                             : 0)
    //                           : bitcoinEffectiveBalance
    // console.log('data', this.props.data)
    // const { sourceCoin, targetCoin, amount } = this.state

    // return (
    //   <FirstStep
    //     sourceCoin={sourceCoin}
    //     targetCoin={targetCoin}
    //     sourceAmount={amount} />
    //     // handleSubmit={this.handleSubmit}
    //     // max={effectiveBalance}
    //     // {...rest} />
    // )
    const { data } = this.props
    const { sourceCoin, targetCoin } = this.state

    return data.cata({
      Success: (value) => <Success
        sourceCoin={sourceCoin}
        targetCoin={targetCoin}
        elements={value.elements}
        handleSwap={this.handleSwap}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  // accounts: formValueSelector('exchange')(state, 'accounts'),
  // amount: formValueSelector('exchange')(state, 'amount'),
  // ethFeeRegular: selectors.core.data.ethereum.getFeeRegular(state) || 0,
  // gasLimit: selectors.core.data.ethereum.getGasLimit(state) || 0,
  // bitcoinFeeValues: selectors.core.data.bitcoin.getFee(state),
  // etherBalance: selectors.core.data.ethereum.getBalance(state),
  // bitcoinEffectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state) || 0
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  // exchangeActions: bindActionCreators(actions.modules.exchange, dispatch),
  // sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
