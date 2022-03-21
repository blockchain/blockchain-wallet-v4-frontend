import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { ExtractSuccess, WalletFiatEnum } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

class CryptoSelection extends React.Component<Props> {
  componentDidMount() {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.priceActions.fetchCoinPrices()
      this.props.priceActions.fetchCoinPricesPreviousDay()
      const currentCurrencyIsInSupportedFiat = this.props.fiatCurrency in WalletFiatEnum
      // for other currencies use as pre fill USD
      const currency = currentCurrencyIsInSupportedFiat ? this.props.fiatCurrency : 'USD'
      this.props.buySellActions.fetchPairs({ currency })
      this.props.buySellActions.fetchFiatEligible(this.props.fiatCurrency)
      this.props.buySellActions.fetchSDDEligibility()
      this.props.buySellActions.fetchBSOrders()
    }
  }

  shouldComponentUpdate = (nextProps) => !equals(this.props, nextProps)

  errorCallback() {
    this.props.buySellActions.setStep({
      fiatCurrency: this.props.fiatCurrency,
      step: 'CRYPTO_SELECTION'
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbTryCurrencySelectionAgain'
          handler={this.errorCallback}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state) || 'USD',
  isFirstLogin: selectors.auth.getFirstLogin(state),
  originalFiatCurrency: selectors.components.buySell.getOriginalFiatCurrency(state),
  sddTransactionFinished: selectors.components.buySell.getSddTransactionFinished(state),
  showTradingCurrency: selectors.core.walletOptions.getTradingCurrency(state).getOrElse(false)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  priceActions: bindActionCreators(actions.prices, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CryptoSelection)
