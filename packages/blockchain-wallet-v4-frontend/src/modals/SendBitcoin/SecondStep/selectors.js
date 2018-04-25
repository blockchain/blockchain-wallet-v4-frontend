import { selectors } from 'data'

export const getData = state => {
  const paymentR = selectors.components.sendBtc.getPayment(state)

  const from = payment => {
    switch (payment.fromType) {
      case 'FROM.ACCOUNT':
        return selectors.core.wallet.getAccountLabel(state)(payment.fromAccountIdx)
      case 'FROM.LEGACY':
        // TODO :: shall we show multiple froms? (map selector and concat)
        return selectors.core.wallet.getLegacyAddressLabel(state)(payment.from[0])
      case 'FROM.WATCH_ONLY':
      case 'FROM.EXTERNAL':
      default:
        return payment.from[0]
    }
  }

  const to = target => {
    switch (target.type) {
      case 'TO.ACCOUNT':
        return selectors.core.wallet.getAccountLabel(state)(target.accountIndex)
      case 'TO.ADDRESS':
        let label = selectors.core.wallet.getLegacyAddressLabel(state)(target.address)
        return label || target.address
      default:
        return target.address
    }
  }

  const transform = payment => ({
    message: payment.description,
    fromAddress: from(payment),
    toAddress: payment.to.map(to)[0],
    amount: payment.amount[0],
    fee: payment.selection.fee,
    total: payment.selection.fee + payment.amount[0]
  })

  return paymentR.map(transform)
}
