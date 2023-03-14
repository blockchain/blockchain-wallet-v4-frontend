import { lift } from 'ramda'

import { CrossBorderLimits, ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

import * as ResultAmountViewModel from './models/resultAmountViewModel'

const selectResultAmountViewModel = (state: RootState) => {
  const quotePrice = selectors.components.swap.getQuotePrice(state)
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const coins = selectors.core.data.coins.getCoins()
  const { coinfig } = coins[initSwapFormValues?.COUNTER?.coin || 'BTC']

  return ResultAmountViewModel.make(quotePrice, coinfig)
}

const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('swapAmount')(state)
  const formValues = selectors.form.getFormValues('swapAmount')(state) as SwapAmountFormValues
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const limitsR = selectors.components.swap.getLimits(state)
  const paymentR = selectors.components.swap.getPayment(state)
  const quotePriceR = selectors.components.swap.getQuotePrice(state)
  const baseRatesR = selectors.core.data.misc.getRatesSelector(
    initSwapFormValues?.BASE?.coin || 'BTC',
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  const crossBorderLimits = selectors.components.swap
    .getCrossBorderLimits(state)
    .getOrElse({} as CrossBorderLimits)
  const resultAmountViewModel = selectResultAmountViewModel(state)
  return lift(
    (
      limits: ExtractSuccess<typeof limitsR>,
      baseRates: ExtractSuccess<typeof baseRatesR>,
      walletCurrency: FiatType,
      quotePrice: ExtractSuccess<typeof quotePriceR>
    ) => ({
      accounts,
      baseRates,
      crossBorderLimits,
      formErrors,
      formValues,
      limits,
      payment: paymentR.getOrElse(undefined),
      quotePrice,
      resultAmountViewModel,
      walletCurrency
    })
  )(limitsR, baseRatesR, walletCurrencyR, quotePriceR)
}

export default getData
