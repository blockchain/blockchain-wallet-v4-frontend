import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors, model } from 'data'

const { EXCHANGE_FORM } = model.components.exchange

export const { getMin, getMax } = selectors.components.exchange
const getFormError = selectors.form.getFormError(EXCHANGE_FORM)

export const getData = createDeepEqualSelector(
  [getMin, getMax, getFormError],
  (min, max, error) => ({ min, max, error })
)
