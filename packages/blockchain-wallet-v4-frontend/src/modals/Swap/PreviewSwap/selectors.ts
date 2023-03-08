import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

export const getData = (state: RootState) => {
  const incomingAmountR = selectors.components.swap.getIncomingAmount(state)
  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType
  const paymentR = selectors.components.swap.getPayment(state)
  const quoteR = selectors.components.swap.getQuote(state)
  const swapAmountFormValues = selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues

  return lift(
    (
      incomingAmount: ExtractSuccess<typeof incomingAmountR>,
      payment: ExtractSuccess<typeof paymentR>,
      quote: ExtractSuccess<typeof quoteR>
    ) => ({
      incomingAmount,
      initSwapFormValues,
      payment,
      quote,
      swapAmountFormValues
    })
  )(incomingAmountR, paymentR, quoteR)
}

export default getData
