import { selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const paymentR = selectors.components.sendBch.getPayment(state)
  const from = payment => {
    switch (payment.fromType) {
      case 'FROM.ACCOUNT':
        return selectors.core.kvStore.bch.getAccountLabel(state)(payment.fromAccountIdx).getOrElse(payment.from[0])
      case 'FROM.LEGACY':
        return utils.bch.toCashAddr(payment.from[0], true)
      case 'FROM.WATCH_ONLY':
        return utils.bch.toCashAddr(payment.from[0], true)
      case 'FROM.EXTERNAL':
        return utils.bch.toCashAddr(payment.from[0], true)
      default:
        return payment.from[0]
    }
  }

  const to = target => {
    switch (target.type) {
      case 'TO.ACCOUNT':
        return selectors.core.kvStore.bch.getAccountLabel(state)(target.accountIndex).getOrElse(target.address)
      case 'TO.ADDRESS':
        return utils.bch.toCashAddr(target.address, true)
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
