import { select } from 'redux-saga/effects'
import { put } from 'typed-redux-saga'

import { selectors } from 'data'
import { trackEvent } from 'data/analytics/slice'
import { Analytics } from 'data/analytics/types'
import { InitSwapFormValuesType, SwapBaseCounterTypes } from 'data/components/swap/types'
import { notReachable } from 'utils/helpers'

import { actions } from '../slice'

const mapType = (type: SwapBaseCounterTypes): string => {
  switch (type) {
    case SwapBaseCounterTypes.ACCOUNT:
      return 'USERKEY'
    case SwapBaseCounterTypes.CUSTODIAL:
      return 'TRADING'
    default:
      return notReachable(type)
  }
}

export const trackAccountsSelected = function* ({ payload }: ReturnType<typeof actions.setStep>) {
  if (payload.step !== 'ENTER_AMOUNT') {
    return
  }

  const initSwapFormValues = selectors.form.getFormValues('initSwap')(
    yield select()
  ) as InitSwapFormValuesType

  if (!initSwapFormValues || !initSwapFormValues.BASE || !initSwapFormValues.COUNTER) {
    return
  }

  const { BASE: input, COUNTER: output } = initSwapFormValues

  yield* put(
    trackEvent({
      key: Analytics.SWAP_ACCOUNTS_SELECTED,
      properties: {
        input_currency: input.coin,
        input_type: mapType(input.type),
        output_currency: output.coin,
        output_type: mapType(output.type),
        was_suggested: payload.isSuggestedPair || false
      }
    })
  )
}
