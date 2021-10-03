import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { toLower } from 'ramda'
import { bindActionCreators } from 'redux'

import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'

import { Props as TableProps } from '..'
import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'

class CoinBalance extends React.PureComponent<Props> {
  handleRefresh = (e?: KeyboardEvent) => {
    if (e) {
      e.preventDefault()
    }
    const { coin } = this.props
    const { coinfig } = window.coins[coin]
    if (coinfig.type.erc20Address) {
      this.props.ethActions.fetchErc20Data(coin)
    } else {
      const coinLower = toLower(coin)
      this.props[`${coinLower}Actions`].fetchData()
    }
  }

  render() {
    const { coin, data } = this.props

    return data.cata({
      Failure: () => <Error coin={coin} onRefresh={(e) => this.handleRefresh(e)} />,
      Loading: () => <SkeletonRectangle height='35px' width='60px' />,
      NotAsked: () => <SkeletonRectangle height='35px' width='60px' />,
      Success: (value) => <Success balance={value} coin={coin} />
    })
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  bchActions: bindActionCreators(actions.core.data.bch, dispatch),
  btcActions: bindActionCreators(actions.core.data.btc, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  stxActions: bindActionCreators(actions.core.data.stx, dispatch),
  xlmActions: bindActionCreators(actions.core.data.xlm, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = TableProps & { coin: string }
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinBalance)
