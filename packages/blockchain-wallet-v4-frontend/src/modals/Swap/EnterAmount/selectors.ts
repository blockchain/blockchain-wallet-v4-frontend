import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('swapAmount')(state)
  const formValues = selectors.form.getFormValues('swapAmount')(state) as SwapAmountFormValues
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
  const coins = selectors.components.swap.getCoins()
  const accounts = getCoinAccounts(state, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  return lift(
    (
      incomingAmount: ExtractSuccess<typeof incomingAmountR>,
      limits: ExtractSuccess<typeof limitsR>,
      quote: ExtractSuccess<typeof quoteR>,
      baseRates: ExtractSuccess<typeof baseRatesR>,
      walletCurrency: FiatType
    ) => ({
      accounts,
      baseRates,
      formErrors,
      formValues,
      incomingAmount,
      limits,
      payment: paymentR.getOrElse(undefined),
      quote,
      walletCurrency
    })
  )(incomingAmountR, limitsR, quoteR, baseRatesR, walletCurrencyR)
}

export default getData
