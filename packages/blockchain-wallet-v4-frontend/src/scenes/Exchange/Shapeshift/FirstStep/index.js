import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, path, prop } from 'ramda'
// import * as crypto from 'crypto'
import { utils, Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import { actions, selectors } from 'data'
// import { calculateEffectiveBalance } from './services'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
//   this.seed = crypto.randomBytes(16).toString('hex')

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    // this.seed = crypto.randomBytes(16).toString('hex')
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = { effectiveBalance: 0 }
  }

  componentWillMount () {
    const defaultAccount = this.props.defaultAccounts.BTC
    this.props.dataBitcoinActions.fetchUnspent(prop('address', defaultAccount) || prop('index', defaultAccount))
    this.props.dataShapeshiftActions.fetchBtcEth()
  }

  componentWillReceiveProps (nextProps) {
    // Update if source account has changed
    if (!equals(this.props.source, nextProps.source)) {
      // Fetch unspent if coin is BTC
      if (equals('BTC', nextProps.sourceCoin)) {
        this.props.dataBitcoinActions.fetchUnspent(prop('address', nextProps.source) || prop('index', nextProps.source))
      }
      // ETH Calculate effectiveBalance
      if (equals('ETH', nextProps.sourceCoin)) {
        const ethAccount = prop('address', nextProps.source)
        const ethBalance = path([ethAccount, 'balance'], nextProps.ethAddresses)
        const data = utils.ethereum.calculateFeeAndEffectiveBalanceEther(nextProps.ethFee.priority, nextProps.ethFee.gasLimit, ethBalance)
        this.setState({ effectiveBalance: data.effectiveBalance.toString() })
      }
    }
    // Update if source or target have changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) || !equals(this.props.targetCoin, nextProps.targetCoin)) {
      // Fetch rates
      if (equals('BTC', nextProps.sourceCoin) || equals('BTC', nextProps.targetCoin)) this.props.dataBitcoinActions.fetchRates()
      if (equals('ETH', nextProps.sourceCoin) || equals('ETH', nextProps.targetCoin)) this.props.dataEthereumActions.fetchRates()
      // Fetch pair if source or target coins have changed
      if (equals('BTC', nextProps.sourceCoin) && equals('ETH', nextProps.targetCoin)) this.props.dataShapeshiftActions.fetchBtcEth()
      if (equals('ETH', nextProps.sourceCoin) && equals('BTC', nextProps.targetCoin)) this.props.dataShapeshiftActions.fetchEthBtc()
    }
    // BTC Calculate effectiveBalance
    if (equals('BTC', nextProps.sourceCoin) && Remote.Success.is(nextProps.coins)) {
      const coins = nextProps.coins.getOrElse([])
      const data = utils.bitcoin.calculateFeeAndEffectiveBalanceBitcoin(coins, nextProps.btcFee.priority)
      this.setState({ effectiveBalance: data.effectiveBalance.toString() })
    }
  }

  handleSubmit () {
    this.props.nextStep()
  }

  render () {
    console.log('STATE', this.state.effectiveBalance)
    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} effectiveBalance={this.state.effectiveBalance} handleSubmit={this.handleSubmit} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading {...this.props} />,
      NotAsked: () => <Loading {...this.props} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  coins: selectors.core.data.bitcoin.getCoins(state),
  ethAddresses: selectors.core.data.ethereum.getAddresses(state).getOrElse({})
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
