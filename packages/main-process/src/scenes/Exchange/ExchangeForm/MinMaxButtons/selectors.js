import { includes, equals, gte, isNil, prop } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors, model } from 'data'

const {
  EXCHANGE_FORM,
  NO_LIMITS_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  REACHED_ANNUAL_ERROR,
  MINIMUM_NO_LINK_ERROR
} = model.components.exchange

export const { getMin, getMax } = selectors.components.exchange
const getFormError = selectors.form.getFormError(EXCHANGE_FORM)

export const getData = createDeepEqualSelector(
  [getMin, getMax, getFormError],
  (min, max, error) => ({
    minIsFiat: prop('fiat', min),
    minSymbol: prop('symbol', min),
    minAmount: prop('amount', min),
    maxIsFiat: prop('fiat', max),
    maxSymbol: prop('symbol', max),
    maxAmount: prop('amount', max),
    disabled:
      includes(error, [
        NO_LIMITS_ERROR,
        MINIMUM_NO_LINK_ERROR,
        REACHED_DAILY_ERROR,
        REACHED_WEEKLY_ERROR,
        REACHED_ANNUAL_ERROR
      ]) ||
      (equals(prop('symbol', min), prop('symbol', max)) &&
        gte(Number(prop('amount', min)), Number(prop('amount', max)))) ||
      isNil(min) ||
      isNil(max)
  })
)
