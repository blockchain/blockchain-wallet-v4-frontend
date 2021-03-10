import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { includes, toLower } from 'ramda'
import { bindActionCreators } from 'redux'

import { CoinType, ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import { LoadingBalance } from '../../model'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'

class Balance extends React.PureComponent<Props> {
  handleRefresh = () => {
    const { coin } = this.props
    const coinLower = toLower(coin)
    if (includes(coin, this.props.erc20List)) {
      this.props.ethActions.fetchErc20Data(coinLower)
    } else {
      this.props[`${coinLower}Actions`].fetchData()
    }
  }

  render() {
    const { coin, coinTicker, data, large } = this.props

    return data.cata({
      Success: value => (
        <Success
          {...this.props}
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
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  stxActions: bindActionCreators(actions.core.data.stx, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  coinTicker: string
  large: boolean
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Balance)
