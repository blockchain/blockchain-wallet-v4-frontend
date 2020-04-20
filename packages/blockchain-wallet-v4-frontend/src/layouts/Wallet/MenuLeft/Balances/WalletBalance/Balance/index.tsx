import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { CoinType, Erc20CoinType, RemoteDataType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { includes, toLower } from 'ramda'
import { LoadingBalance } from '../../model'
import Error from './template.error'
import React from 'react'
import Success from './template.success'

class Balance extends React.PureComponent<Props> {
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
  stxActions: bindActionCreators(actions.core.data.stx, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  coin: CoinType
  coinTicker: string
  large: boolean
}
type LinkDispatchPropsType = {
  bchActions: typeof actions.core.data.bch
  btcActions: typeof actions.core.data.btc
  ethActions: typeof actions.core.data.eth
  stxActions: typeof actions.core.data.stx
  xlmActions: typeof actions.core.data.xlm
}
type LinkStatePropsType = {
  data: RemoteDataType<string, string | number>
  erc20List: Array<Erc20CoinType>
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Balance)
