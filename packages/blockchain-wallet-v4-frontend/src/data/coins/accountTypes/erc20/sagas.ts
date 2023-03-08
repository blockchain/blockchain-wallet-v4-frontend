import { head } from 'ramda'
import { select } from 'typed-redux-saga'

import { PaymentValue } from '@core/redux/payment/types'
import { selectors } from 'data'

export const getNextReceiveAddress = function* (coin: string) {
  const address: string | undefined = selectors.core.kvStore.eth
    .getDefaultAddress(yield* select())
    .getOrFail(`Failed to get ${coin} receive address.`)

  return { address }
}

export const getDefaultAccount = function* (coin: string) {
  const erc20AccountR = yield* select(selectors.core.common.eth.getErc20AccountBalances, coin)
  return erc20AccountR.map(head)
}

export const getOrUpdateProvisionalPayment = function* (coreSagas, networks, paymentR) {
  return yield* coreSagas.payment.eth.create({
    network: networks.eth,
    payment: paymentR.getOrElse(<PaymentValue>{})
  })
}
