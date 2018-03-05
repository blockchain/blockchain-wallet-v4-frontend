import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, isNil, path, prop } from 'ramda'
// import * as crypto from 'crypto'
import { utils } from 'blockchain-wallet-v4/src'
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
    this.props.dataBitcoinActions.fetchFee()
    const defaultAccount = this.props.defaultAccounts.BTC
    this.props.dataBitcoinActions.fetchUnspent(prop('address', defaultAccount) || prop('index', defaultAccount))
    this.props.dataShapshiftActions.fetchBtcEth()
  }

  componentWillReceiveProps (nextProps) {
    // Fetch fee if sourceCoin has changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin)) {
      if (equals('BTC', nextProps.sourceCoin)) this.props.dataBitcoinActions.fetchFee()
      if (equals('ETH', nextProps.sourceCoin)) this.props.dataEthereumActions.fetchFee()
    }
    // Update if source account has changed
    if (!isNil(this.props.accounts) && !isNil(nextProps.accounts) && !equals(this.props.accounts.source, nextProps.accounts.source)) {
      // Fetch unspent if coin is BTC
      if (equals('BTC', nextProps.sourceCoin)) {
        const source = path(['accounts', 'source'], nextProps)
        this.props.dataBitcoinActions.fetchUnspent(prop('address', source) || prop('index', source))
      }
      // ETH Calculate effectiveBalance
      if (equals('ETH', nextProps.sourceCoin)) {
        const ethAccount = path(['source', 'address'], nextProps.accounts)
        const { ethFee } = nextProps.data.getOrElse({ ethFee: { priority: 0, gasLimit: 21000 } })
        const ethBalance = path([ethAccount, 'balance'], nextProps.ethAddresses)
        const effectiveBalance = utils.ethereum.calculateEffectiveBalanceEther(ethFee.priority, ethFee.gasLimit, ethBalance)
        this.setState({ effectiveBalance })
      }
    }
    // Fetch pair if source or target coins have changed
    if (!equals(this.props.sourceCoin, nextProps.sourceCoin) || !equals(this.props.targetCoin, nextProps.targetCoin)) {
      if (equals('BTC', nextProps.sourceCoin) && equals('ETH', nextProps.targetCoin)) this.props.dataShapshiftActions.fetchBtcEth()
      if (equals('ETH', nextProps.sourceCoin) && equals('BTC', nextProps.targetCoin)) this.props.dataShapshiftActions.fetchEthBtc()
    }
    // BTC Calculate effectiveBalance
    if (!equals(this.props.coins, nextProps.coins)) {
      const { btcFee } = nextProps.data.getOrElse({ btcFee: { priority: 0 } })
      const effectiveBalance = utils.bitcoin.calculateEffectiveBalanceBitcoin(nextProps.coins, btcFee.priority)
      this.setState({ effectiveBalance })
    }
  }

  handleSubmit () {
    console.log('handleSubmit')
    console.log(this.props)
    this.props.nextStep()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} effectiveBalance={this.state.effectiveBalance} handleSubmit={this.handleSubmit} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading {...this.props} />,
      NotAsked: () => <Loading {...this.props} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.accounts),
  ethAddresses: selectors.core.data.ethereum.getAddresses(state).getOrElse({}),
  coins: selectors.core.data.bitcoin.getCoins(state).getOrElse([])
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  dataShapshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
