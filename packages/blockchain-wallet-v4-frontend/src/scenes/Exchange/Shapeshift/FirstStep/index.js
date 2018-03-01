import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, isNil } from 'ramda'
// import * as crypto from 'crypto'

import { getData } from './selectors'
import { actions, selectors } from 'data'
import { calculateEffectiveBalance } from './services'
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
      }
      if (equals('ETH', nextProps.sourceCoin)) {
        this.props.dataEthereumActions.fetchFee()
      }
    }
    // Update if source account
    if (!isNil(this.props.accounts) && !isNil(nextProps.accounts) && !equals(this.props.accounts.source, nextProps.accounts.source)) {
      // Fetch unspent if coin is BTC
      if (equals('BTC', nextProps.sourceCoin)) {
        const source = nextProps.accounts.source
        this.props.dataBitcoinActions.fetchUnspent(source.addr || source.index)
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

  handleSubmit () {
    console.log('handleSubmit')
    console.log(this.props)
    this.props.nextStep()
  }

  render () {
    // console.log('ExchangeFormContainer render', this.props)
    // Calculate effective balance
    const effectiveBalance = calculateEffectiveBalance(this.props)
    console.log('render effectiveBalance', effectiveBalance)

    return this.props.data.cata({
      Success: (value) => <Success {...value} {...this.props} effectiveBalance={effectiveBalance} />,
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
