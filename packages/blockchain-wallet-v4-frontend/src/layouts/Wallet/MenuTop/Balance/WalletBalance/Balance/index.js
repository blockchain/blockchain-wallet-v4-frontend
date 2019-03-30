import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes, toLower } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

const { ERC20_COIN_LIST } = model.coins
class Balance extends React.PureComponent {
  componentDidMount () {
    this.handleRefresh()
  }

  handleRefresh = () => {
    const { coin } = this.props
    switch (true) {
      case coin === 'BTC':
        this.props.btcActions.fetchData()
        break
      case coin === 'BCH':
        this.props.bchActions.fetchData()
        break
      case coin === 'BSV':
        this.props.bsvActions.fetchData()
        break
      case coin === 'ETH':
        this.props.ethActions.fetchData()
        break
      case coin === 'XLM':
        this.props.xlmActions.fetchData()
        break
      case includes(coin, ERC20_COIN_LIST):
        this.props.ethActions.fetchErc20Data(toLower(coin))
        break
      default:
        this.props.logActions.logErrorMessage(
          'MenuTop/Balance/WalletBalance',
          'handleRefresh',
          'Unsupported Coin Code'
        )
    }
  }

  render () {
    const { coin, data, large } = this.props

    return data.cata({
      Success: value => <Success balance={value} large={large} coin={coin} />,
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coin={coin} />,
      NotAsked: () => <LoadingBalance large={large} coin={coin} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  bsvActions: bindActionCreators(actions.core.data.bsv, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  logActions: bindActionCreators(actions.logs, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance)
