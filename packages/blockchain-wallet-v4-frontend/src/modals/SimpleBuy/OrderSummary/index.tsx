import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'
import DataError from 'components/DataError'
import Loading from '../AddCard/template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class OrderSummary extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBCards()
    }
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({
      BTC: { colorCode: 'btc' },
      BCH: { colorCode: 'bch' },
      ETH: { colorCode: 'eth' },
      PAX: { colorCode: 'pax' },
      USDT: { colorCode: 'usdt' },
      STX: { colorCode: 'stx' },
      XLM: { colorCode: 'xlm' }
    })
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(OrderSummary)
