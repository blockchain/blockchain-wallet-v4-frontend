import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { includes, toLower } from 'ramda'
import React from 'react'

import { actions, selectors } from 'data'
import { CoinType, FiatTypeEnum } from 'blockchain-wallet-v4/src/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent<Props> {
  componentDidMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      const { coin, erc20List } = this.props
      if (coin in FiatTypeEnum) {
        return
      }
      if (includes(coin, erc20List)) {
        return this.props.ethActions.fetchErc20Rates(toLower(this.props.coin))
      }
      return this.props[`${toLower(coin)}Actions`].fetchRates()
    }
  }

  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => <Success {...rest}>{value}</Success>,
      Failure: () => <Error {...rest} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(
    state,
    ownProps.coin,
    ownProps.children,
    ownProps.currency,
    ownProps.rates
  ),
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch),
  algoActions: bindActionCreators(actions.core.data.algo, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = { coin: CoinType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatDisplayContainer)
