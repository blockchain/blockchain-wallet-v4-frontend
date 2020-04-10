import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState } from 'data/rootReducer'
import { SBOrderType, SupportedCoinsType } from 'core/types'
import React, { PureComponent } from 'react'
import Success from './template'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  supportedCoins: SupportedCoinsType
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class OrderSummary extends PureComponent<Props> {
  state = {}

  render () {
    return <Success {...this.props} />
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({
      BTC: { colorCode: 'btc' },
      BCH: { colorCode: 'bch' },
      ETH: { colorCode: 'eth' },
      PAX: { colorCode: 'pax' },
      STX: { colorCode: 'stx' },
      XLM: { colorCode: 'xlm' }
    })
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderSummary)
