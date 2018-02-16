import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as crypto from 'crypto'

import { getData } from './selectors'
import { actions } from 'data'
import { initializeForm, changeCoin, swapCoin } from './services'
// import FirstStep from './template.js'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSwap = this.handleSwap.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    // Initialize form
    initializeForm(this.props, nextProps)
    // // Update target/source if source/target has changed
    changeCoin(this.props, nextProps)
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
    swapCoin(this.props)
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

    const { data } = this.props

    return data.cata({
      Success: (value) => <Success
        sourceCoin={value.sourceCoin}
        targetCoin={value.targetCoin}
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
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
