import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { includes, toLower } from 'ramda'
import React from 'react'

import { actions, selectors } from 'data'
import { CoinType } from 'core/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent<Props> {
  componentDidMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      const { coin, erc20List } = this.props
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
  erc20List: selectors.core.walletOptions.getErc20CoinList(state).getOrFail()
})

const mapDispatchToProps = dispatch => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = { coin: CoinType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatDisplayContainer)
