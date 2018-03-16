import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, path, prop } from 'ramda'

import { utils, Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import { getPairFromCoin } from 'services/ShapeshiftService'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { effectiveBalance: 0 }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    const defaultAccount = this.props.defaultAccounts.BTC
    this.props.dataBitcoinActions.fetchUnspent(prop('address', defaultAccount) || prop('index', defaultAccount))
    this.props.dataShapeshiftActions.fetchPair('btc_eth')
  }

  componentWillReceiveProps (nextProps) {
    // Update if source account has changed
    if (!equals(this.props.source, nextProps.source)) {
      // Fetch unspent if coin is BTC
      if (equals('BTC', nextProps.sourceCoin)) {
        this.props.dataBitcoinActions.fetchUnspent(prop('address', nextProps.source) || prop('index', nextProps.source))
      }
    }
    // Update if source or target have changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) || !equals(this.props.targetCoin, nextProps.targetCoin)) {
      // Fetch rates
      if (equals('BCH', nextProps.sourceCoin) || equals('BCH', nextProps.targetCoin)) this.props.dataBchActions.fetchRates()
      if (equals('BTC', nextProps.sourceCoin) || equals('BTC', nextProps.targetCoin)) this.props.dataBitcoinActions.fetchRates()
      if (equals('ETH', nextProps.sourceCoin) || equals('ETH', nextProps.targetCoin)) this.props.dataEthereumActions.fetchRates()
      // Fetch pair if source or target coins have changed
      this.props.dataShapeshiftActions.fetchPair(getPairFromCoin(nextProps.sourceCoin, nextProps.targetCoin))
    }
    // ETH Calculate effectiveBalance
    if (equals('ETH', nextProps.sourceCoin) || !equals(this.props.ethFee, nextProps.ethFee)) {
      const ethAccount = prop('address', nextProps.source)
      const ethBalance = path([ethAccount, 'balance'], nextProps.ethAddresses)
      const data = utils.ethereum.calculateBalanceEther(nextProps.ethFee.priority, nextProps.ethFee.gasLimit, ethBalance)
      this.setState({ effectiveBalance: data.effectiveBalance })
    }
    // BTC Calculate effectiveBalance
    if ((equals('BTC', nextProps.sourceCoin) || !equals(this.props.btcFee, nextProps.btcFee)) && Remote.Success.is(nextProps.btcCoins)) {
      const coins = nextProps.btcCoins.getOrElse([])
      const data = utils.bitcoin.calculateBalanceBitcoin(coins, nextProps.btcFee.priority)
      this.setState({ effectiveBalance: data.effectiveBalance })
    }
    // BTC Calculate effectiveBalance
    if ((equals('BCH', nextProps.sourceCoin) || !equals(this.props.bchFee, nextProps.bchFee)) && Remote.Success.is(nextProps.bchCoins)) {
      const coins = nextProps.bchCoins.getOrElse([])
      const data = utils.bitcoin.calculateBalanceBitcoin(coins, nextProps.btcFee.priority)
      this.setState({ effectiveBalance: data.effectiveBalance })
    }
  }

  handleSubmit () {
    this.props.nextStep()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success
        {...value}
        {...this.props}
        effectiveBalance={this.state.effectiveBalance}
        handleSubmit={this.handleSubmit}
      />,
      Failure: (message) => <Error />,
      Loading: () => <Loading {...this.props} />,
      NotAsked: () => <Loading {...this.props} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  btcCoins: selectors.core.data.bitcoin.getCoins(state),
  bchCoins: selectors.core.data.bch.getCoins(state),
  ethAddresses: selectors.core.data.ethereum.getAddresses(state).getOrElse({})
})

const mapDispatchToProps = (dispatch) => ({
  dataBchActions: bindActionCreators(actions.core.data.bch, dispatch),
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
