import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import * as crypto from 'crypto'

import { getData } from './selectors'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import ExchangeForm from './ExchangeForm'

class FirstStepContainer extends React.Component {
  // constructor (props) {
  //   super(props)
  //   this.timeout = undefined
  //   this.seed = crypto.randomBytes(16).toString('hex')
  // }

  componentWillMount () {
    this.props.dataBitcoinActions.fetchFee()
    this.props.dataBitcoinActions.fetchRates()
    this.props.dataBitcoinActions.fetchUnspent(this.props.defaultBtcAccountIndex)
    this.props.dataEthereumActions.fetchFee()
    this.props.dataEthereumActions.fetchRates()
  }

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

    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <ExchangeForm {...value} {...rest} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  defaultBtcAccountIndex: selectors.core.wallet.getDefaultAccountIndex(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  shapeshiftDataActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
