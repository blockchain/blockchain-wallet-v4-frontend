import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { toLower } from 'ramda'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatDisplayContainer extends React.PureComponent<Props> {
  componentDidMount() {
    if (Remote.NotAsked.is(this.props.data)) {
      const { coin } = this.props
      const { coinfig } = window.coins[coin]
      if (coinfig.type.name === 'FIAT') {
        return
      }
      if (coinfig.type.erc20Address) {
        return
      }
      if (selectors.core.data.coins.getCoins().includes(coin)) {
        return
      }
      return this.props[`${toLower(coin)}Actions`].fetchRates()
    }
  }

  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Failure: () => <Error {...rest} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />,
      Success: (value) => <Success {...rest}>{value}</Success>
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin, ownProps.children, ownProps.currency, ownProps.rates)
})

const mapDispatchToProps = (dispatch) => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = { coin: CoinType }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatDisplayContainer)
