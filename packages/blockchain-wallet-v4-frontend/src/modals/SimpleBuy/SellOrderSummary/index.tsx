import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  FiatTypeEnum,
  SupportedCoinType,
  SupportedWalletCurrenciesType,
  SwapOrderType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import Success from './template.success'

// This is a new order summary created for sell p3. Order type looks like what is currently a swap order type rather than an SB order type
// Created this separate template so that we don't have to force types to match. Should be resued when Buy uses swap2.0 apis, and OrderSummary folder
// can be deleted

class SellOrderSummary extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.fetchSBOrders()
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    return <Success {...this.props} />
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  sellOrder: selectors.components.simpleBuy.getSellOrder(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({
      ALGO: { colorCode: 'algo' } as SupportedCoinType,
      BTC: { colorCode: 'btc' } as SupportedCoinType,
      BCH: { colorCode: 'bch' } as SupportedCoinType,
      ETH: { colorCode: 'eth' } as SupportedCoinType,
      PAX: { colorCode: 'pax' } as SupportedCoinType,
      USDT: { colorCode: 'usdt' } as SupportedCoinType,
      WDGLD: { colorCode: 'wdgld' } as SupportedCoinType,
      XLM: { colorCode: 'xlm' } as SupportedCoinType
    } as Omit<SupportedWalletCurrenciesType, keyof FiatTypeEnum>)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}

type LinkStatePropsType = {
  sellOrder: SwapOrderType | undefined,
  supportedCoins: SupportedWalletCurrenciesType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SellOrderSummary)
