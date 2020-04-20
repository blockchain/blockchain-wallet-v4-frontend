import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { CoinType, Erc20CoinType, RemoteDataType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { includes, toLower } from 'ramda'
import { SkeletonRectangle } from 'blockchain-info-components'
import { Props as TableProps } from '../Table'
import Error from './template.error'
import React from 'react'
import Success from './template.success'

class CoinBalance extends React.PureComponent<Props> {
  handleRefresh = (e?: KeyboardEvent) => {
    if (e) {
      e.preventDefault()
    }
    const { coin } = this.props
    const coinLower = toLower(coin)
    if (includes(coin, this.props.erc20List)) {
      this.props.ethActions.fetchErc20Data(coinLower)
    } else {
      this.props[`${coinLower}Actions`].fetchData()
    }
  }

  render () {
    const { coin, data } = this.props

    return data.cata({
      Success: value => <Success balance={value} coin={coin} />,
      Failure: () => (
        <Error coin={coin} onRefresh={e => this.handleRefresh(e)} />
      ),
      Loading: () => <SkeletonRectangle height='35px' width='60px' />,
      NotAsked: () => <SkeletonRectangle height='35px' width='60px' />
    })
  }
}

const mapStateToProps = (state, ownProps: OwnProps): LinkStatePropsType => ({
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

export type OwnProps = TableProps & { coin: CoinType }
type LinkStatePropsType = {
  data: RemoteDataType<string, string | number>
  erc20List: Array<Erc20CoinType>
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinBalance)
