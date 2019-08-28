import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { includes, toLower } from 'ramda'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'
import { LoadingBalance } from 'components/Balances'

class Balance extends React.PureComponent {
  componentDidMount () {
    this.handleRefresh()
  }

  handleRefresh = () => {
    const { coin } = this.props
    const coinLower = toLower(coin)
    if (includes(coin, this.props.erc20List)) {
      this.props.ethActions.fetchErc20Data(coinLower)
    } else {
      this.props[`${coinLower}Actions`].fetchData()
    }
  }

  render () {
    const { coin, coinTicker, data, large } = this.props

    return data.cata({
      Success: value => (
        <Success
          balance={value}
          large={large}
          coin={coin}
          coinTicker={coinTicker}
        />
      ),
      Failure: () => <Error onRefresh={this.handleRefresh} />,
      Loading: () => <LoadingBalance large={large} coinTicker={coinTicker} />,
      NotAsked: () => <LoadingBalance large={large} coinTicker={coinTicker} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps),
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrFail()
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance)
