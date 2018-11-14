import { createSelector } from 'reselect'

import { Remote } from 'blockchain-wallet-v4'
import { getCurrentPairAmounts } from '../selectors'
import { selectors, model } from 'data'

const { EXCHANGE_FORM } = model.components.exchange
const getFormError = selectors.form.getFormError(EXCHANGE_FORM)
const isDirty = selectors.form.isDirty(EXCHANGE_FORM)
const isSubmitting = selectors.form.isSubmitting(EXCHANGE_FORM)
const isAsyncValidating = selectors.form.isAsyncValidating(EXCHANGE_FORM)

const { getTxError } = selectors.components.exchange

export const getData = createSelector(
  [
    (state, ownProps) =>
      !Remote.Success.is(getCurrentPairAmounts(state, ownProps)),
    getFormError,
    getTxError,
    isAsyncValidating,
    isDirty,
    isSubmitting
  ],
  (disabled, error, txError, asyncValidating, dirty, submitting) => ({
    disabled,
    error,
    txError,
    asyncValidating,
    dirty,
    submitting
  })
)
