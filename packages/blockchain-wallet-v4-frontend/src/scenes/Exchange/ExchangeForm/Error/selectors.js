import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'

const { EXCHANGE_FORM } = model.components.exchange
const getFormError = selectors.form.getFormError(EXCHANGE_FORM)

const { getTxError, getMin, showError } = selectors.components.exchange

export const getData = createDeepEqualSelector(
  [getMin, getFormError, getTxError, showError],
  (min, error, txError, showError) => ({
    min,
    error,
    txError,
    showError
  })
)
