import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'
import * as crypto from 'crypto'

import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeFormContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.dataBitcoinActions.fetchFee()
    this.props.dataBitcoinActions.fetchUnspent(this.props.defaultAccounts.BTC)
    this.props.dataShapshiftActions.fetchBtcEth()
  }

  componentWillReceiveProps (nextProps) {
    // Fetch fee if sourceCoin has changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin)) {
      if (equals('BTC', nextProps.sourceCoin)) {
        this.props.dataBitcoinActions.fetchFee()
        const source = nextProps.accounts.source
        this.props.dataBitcoinActions.fetchUnspent(source.addr || source.index)
      }
      if (equals('ETH', nextProps.sourceCoin)) {
        this.props.dataEthereumActions.fetchFee()
      }
    }
    // Fetch pair if source or target coins have changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) || !equals(this.props.targetCoin, nextProps.targetCoin)) {
      if (equals('BTC', nextProps.sourceCoin) && equals('ETH', nextProps.targetCoin)) {
        this.props.dataShapshiftActions.fetchBtcEth()
      }
      if (equals('ETH', nextProps.sourceCoin) && equals('BTC', nextProps.targetCoin)) {
        this.props.dataShapshiftActions.fetchEthBtc()
      }
    }
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

  handleSubmit () {
    console.log('handleSubmit')
    console.log(this.props)
    this.props.nextStep()
  }

  render () {
    // console.log('ExchangeFormContainer render', this.props)

    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading {...this.props} />,
      NotAsked: () => <Loading {...this.props} />
    })

    /* // const { accounts, etherBalance, bitcoinEffectiveBalance, ...rest } = this.props
    // const { ethFee } = this.state
    // const effectiveBalance = this.state.sourceCoin === 'ETH'
    //                           ? (etherBalance - this.state.ethFee > 0
    //                             ? etherBalance - ethFee
    //                             : 0)
    //                           : bitcoinEffectiveBalance
    // console.log('data', this.props.data)
    // const { sourceCoin, targetCoin, amount } = this.state
    return <ExchangeForm {...this.props} handleSubmit={this.handleSubmit} /> */
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.accounts)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeFormContainer)
