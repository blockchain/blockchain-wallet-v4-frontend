import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('swapAmount')(state)
  const formValues = selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const incomingAmountR = selectors.components.swap.getIncomingAmount(state)
  const limitsR = selectors.components.swap.getLimits(state)
  const paymentR = selectors.components.swap.getPayment(state)
  const quoteR = selectors.components.swap.getQuote(state)
  const baseRatesR = selectors.core.data.misc.getRatesSelector(
    initSwapFormValues?.BASE?.coin || 'BTC',
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  return lift(
    (
      incomingAmount: ExtractSuccess<typeof incomingAmountR>,
      limits: ExtractSuccess<typeof limitsR>,
      quote: ExtractSuccess<typeof quoteR>,
      baseRates: ExtractSuccess<typeof baseRatesR>,
      walletCurrency: FiatType
    ) => ({
      formErrors,
      formValues,
      incomingAmount,
      limits,
      payment: paymentR.getOrElse(undefined),
      quote,
      baseRates,
      walletCurrency
    })
  )(incomingAmountR, limitsR, quoteR, baseRatesR, walletCurrencyR)
}
