import React, { memo, useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { ExtractSuccess, WalletFiatEnum } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { ClientErrorProperties, PartialClientErrorProperties } from 'data/analytics/types/errors'
import { RootState } from 'data/rootReducer'
import { Analytics, UserDataType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const CryptoSelection: React.FC<Props> = memo((props) => {
  useEffect(() => {
    if (props.walletCurrency && !Remote.Success.is(props.data)) {
      props.priceActions.fetchCoinPrices({ fiatCurrency: props.walletCurrency })
      props.priceActions.fetchCoinPricesPreviousDay()
      const currentCurrencyIsInSupportedFiat = props.walletCurrency in WalletFiatEnum
      // for other currencies use as pre fill USD
      const { preferredFiatTradingCurrency } = props.userData?.currencies
      const currency =
        preferredFiatTradingCurrency ||
        (currentCurrencyIsInSupportedFiat ? props.walletCurrency : 'USD')
      props.buySellActions.fetchPairs({ currency })
      props.buySellActions.fetchFiatEligible(props.walletCurrency)
      props.buySellActions.fetchBSOrders()
    }
  }, [])

  const errorCallback = useCallback(() => {
    props.buySellActions.setStep({
      fiatCurrency: props.walletCurrency,
      step: 'CRYPTO_SELECTION'
    })
  }, [props.walletCurrency, props.buySellActions])

  const trackError = useCallback((error: PartialClientErrorProperties) => {
    props.analyticsActions.trackEvent({
      key: Analytics.CLIENT_ERROR,
      properties: {
        ...error,
        action: 'CoinSelection',
        error: 'OOPS_ERROR',
        title: 'Oops! Something went wrong'
      } as ClientErrorProperties
    })
  }, [])

  return props.data.cata({
    Failure: (error) => {
      trackError(error)
      return (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbTryCurrencySelectionAgain'
          handler={errorCallback}
        />
      )
    },
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...props} {...val} />
  })
}, equals)

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  isFirstLogin: selectors.signup.getFirstLogin(state),
  originalFiatCurrency: selectors.components.buySell.getOriginalFiatCurrency(state),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
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
