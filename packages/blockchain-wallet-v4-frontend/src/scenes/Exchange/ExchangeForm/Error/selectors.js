import { selectors, model } from 'data'

const { EXCHANGE_FORM } = model.components.exchange
const getFormError = selectors.form.getFormError(EXCHANGE_FORM)

const { getTxError, showError } = selectors.components.exchange

export const getData = state => ({
  error: getFormError(state),
  txError: getTxError(state),
  showError: showError(state)
})
