import { curry } from 'ramda'

import { utils } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendBch.FORM)

const isBchLegacyAddress = curry((payment) => {
  const target = payment.to[0]
  return target.type === ADDRESS_TYPES.ADDRESS && !utils.bch.isCashAddr(target.address)
})

const bchToLabel = curry((payment, state) => {
  const target = payment.to[0]
  switch (target.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.bch
        .getAccountLabel(state)(target.accountIndex)
        .getOrElse(target.address)
    default:
      return target.address
  }
})

const bchFromLabel = curry((payment, state) => {
  switch (payment.fromType) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.bch
        .getAccountLabel(state)(payment.fromAccountIdx)
        .getOrElse(payment.from[0])
    case ADDRESS_TYPES.CUSTODIAL:
      return payment.from
    case ADDRESS_TYPES.LEGACY:
      const formValues = selectors.form.getFormValues(model.components.sendBch.FORM)(state)
      const { from } = formValues
      if (from === 'allImportedAddresses') {
        return 'All Imported Bitcoin Cash Addresses'
      }
      return utils.bch.toCashAddr(payment.from[0], true)

    case ADDRESS_TYPES.WATCH_ONLY:
      return utils.bch.toCashAddr(payment.from[0], true)
    case ADDRESS_TYPES.EXTERNAL:
      return utils.bch.toCashAddr(payment.from[0], true)
    default:
      return payment.from[0]
  }
})

export const getData = (state) => {
  const paymentR = selectors.components.sendBch.getPayment(state)

  const transform = (payment) => {
    const fromLabel = bchFromLabel(payment, state)
    const toLabel = bchToLabel(payment, state)
    const isLegacy = isBchLegacyAddress(payment, state)

    return {
      amount: payment.amount[0],
      description: payment.description,
      fee: payment.selection ? payment.selection.fee : 0,
      fromAddress: fromLabel,
      isLegacy,
      submitting: isSubmitting(state),
      toAddress: toLabel,
      total: payment.selection ? payment.selection.fee + payment.amount[0] : payment.amount[0]
    }
  }

  return paymentR.map(transform)
}
