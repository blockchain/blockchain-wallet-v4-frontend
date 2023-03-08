import { head, nth } from 'ramda'
import { select } from 'typed-redux-saga'

import { utils } from '@core'
import { PaymentValue } from '@core/types'
import { selectors } from 'data'
import { getNetworks } from 'data/utils/sagas/getNetworks'

const { formatAddr, isCashAddr, toCashAddr } = utils.bch

export const getNextReceiveAddress = function* (coin: string, index?: number) {
  const networks = yield* getNetworks()
  let address = ''

  switch (coin) {
    case 'BCH': {
      const state = yield* select()
      const defaultAccountIndex =
        index || (yield* select(selectors.core.kvStore.bch.getDefaultAccountIndex)).getOrFail()
      const nextAddress = selectors.core.common.bch
        .getNextAvailableReceiveAddress(networks.bch, defaultAccountIndex, state)
        .getOrFail('Failed to get BCH receive address')

      address = isCashAddr(nextAddress) ? formatAddr(nextAddress) : toCashAddr(nextAddress)
      break
    }
    case 'BTC': {
      const state = yield* select()
      const defaultAccountIndex =
        index || (yield* select(selectors.core.wallet.getDefaultAccountIndex))
      const defaultDerivation = selectors.core.common.btc.getAccountDefaultDerivation(
        defaultAccountIndex,
        state
      )
      address = selectors.core.common.btc
        .getNextAvailableReceiveAddress(networks.btc, defaultAccountIndex, defaultDerivation, state)
        .getOrFail('Failed to get BTC receive address')
      break
    }
    case 'ETH':
      address = selectors.core.kvStore.eth
        .getDefaultAddress(yield* select())
        .getOrFail(`Failed to get ETH receive address`)
      break
    case 'XLM':
      address = selectors.core.kvStore.xlm
        .getDefaultAccountId(yield* select())
        .getOrFail(`Failed to get XLM receive address`)
      break
    default:
  }

  return { address }
}

export const getDefaultAccount = function* (coin: string) {
  switch (coin) {
    case 'BCH':
      const bchAccountsR = yield* select(selectors.core.common.bch.getAccountsBalances)
      const bchDefaultIndex = (yield* select(
        selectors.core.kvStore.bch.getDefaultAccountIndex
      )).getOrElse(0)
      return bchAccountsR.map(nth(bchDefaultIndex))
    case 'BTC':
      const btcAccountsR = yield* select(selectors.core.common.btc.getAccountsBalances)
      const btcDefaultIndex = (yield* select(
        selectors.core.wallet.getDefaultAccountIndex
      )) as number
      return btcAccountsR.map(nth(btcDefaultIndex))
    case 'ETH':
      const ethAccountR = yield* select(selectors.core.common.eth.getAccountBalances)
      return ethAccountR.map(head)
    case 'XLM':
      return (yield* select(selectors.core.common.xlm.getAccountBalances)).map(head)
    default:
  }
}

export const getOrUpdateProvisionalPayment = function* (coreSagas, paymentR, coin: string) {
  const networks = yield* getNetworks()
  return yield* coreSagas.payment[coin.toLowerCase()].create({
    network: networks[coin.toLowerCase()],
    payment: paymentR.getOrElse(<PaymentValue>{})
  })
}
