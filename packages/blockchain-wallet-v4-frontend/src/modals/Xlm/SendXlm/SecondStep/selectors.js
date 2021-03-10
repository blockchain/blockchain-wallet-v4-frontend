import { curry, prop } from 'ramda'

import { utils } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendXlm.FORM)

const xlmFromLabel = curry((payment, state) => {
  const from = payment.from
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.xlm
        .getAccountLabel(state, from.address)
        .getOrElse(from.address)
    case ADDRESS_TYPES.CUSTODIAL:
      return from.address
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxXlmAccount(state, from.address)
        .map(prop('label'))
        .getOrElse(from.address)
    default:
      return from.address
  }
})

export const getData = state => {
  const paymentR = selectors.components.sendXlm.getPayment(state)

  const transform = payment => {
    const fromLabel = xlmFromLabel(payment, state)
    const toLabel = payment.to.label || payment.to.address

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      memo: payment.memo,
      memoType: payment.memoType,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount,
      fee: payment.fee,
      total: utils.xlm.calculateTransactionAmount(payment.amount, payment.fee)
    }
  }

  return paymentR.map(transform)
}
