import { curry, prop } from 'ramda'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendBtc.FORM)

const btcToLabel = curry((payment, state) => {
  const target = payment.to[0]
  switch (target.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.wallet.getAccountLabel(state)(target.accountIndex)
    case ADDRESS_TYPES.ADDRESS:
      let label = selectors.core.wallet.getLegacyAddressLabel(state)(
        target.address
      )
      return label || target.address
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxBtcAccount(state, target.xpub)
        .map(prop('label'))
        .getOrElse(target.address)
    default:
      return target.address
  }
})

const btcFromLabel = curry((payment, state) => {
  switch (payment.fromType) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.wallet.getAccountLabel(state)(
        payment.fromAccountIdx
      )
    case ADDRESS_TYPES.CUSTODIAL:
      return payment.from
    case ADDRESS_TYPES.LEGACY:
      const label = selectors.core.wallet.getLegacyAddressLabel(state)(
        payment.from[0]
      )
      const formValues = selectors.form.getFormValues(
        model.components.sendBtc.FORM
      )(state)
      // @ts-ignore
      const { from } = formValues
      if (from === 'allImportedAddresses') {
        return 'All Imported Bitcoin Addresses'
      } else {
        return label || payment.from[0]
      }
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxBtcAccount(state, payment.from[0])
        .map(prop('label'))
        .getOrElse(payment.from[0])
    case ADDRESS_TYPES.WATCH_ONLY:
    case ADDRESS_TYPES.EXTERNAL:
    default:
      return payment.from[0]
  }
})

export const getData = state => {
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const transform = payment => {
    const fromLabel = btcFromLabel(payment, state)
    const toLabel = btcToLabel(payment, state)

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      fromType: payment.type,
      fromAddress: fromLabel,
      toAddress: toLabel,
      amount: payment.amount[0],
      fee: payment.selection ? payment.selection.fee : 0,
      total: payment.selection
        ? payment.selection.fee + payment.amount[0]
        : payment.amount[0]
    }
  }

  return paymentR.map(transform)
}
