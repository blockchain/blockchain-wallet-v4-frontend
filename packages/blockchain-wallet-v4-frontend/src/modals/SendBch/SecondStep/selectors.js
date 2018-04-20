import { selectors } from 'data'

export const getData = state => {
  const paymentR = selectors.components.sendBch.getPayment(state)
  console.log('selectors', selectors)
  const from = payment => {
    switch (payment.fromType) {
      case 'FROM.ACCOUNT':
        return selectors.core.kvStore.bch.getAccountLabel(state)(payment.fromAccountIdx).getOrElse(payment.from[0])
      case 'FROM.LEGACY':
      case 'FROM.WATCH_ONLY':
      case 'FROM.EXTERNAL':
      default:
        return payment.from[0]
    }
  }

  const to = target => {
    console.log('to', target)
    switch (target.type) {
      case 'TO.ACCOUNT':
        // return selectors.core.wallet.getAccountLabel(state)(target.accountIndex)
        return selectors.core.kvStore.bch.getAccountLabel(state)(target.fromAccountIdx).getOrElse(target.address)
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
