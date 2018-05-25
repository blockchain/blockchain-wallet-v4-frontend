import { selectors } from 'data'
import { curry } from 'ramda'
import { utils } from 'blockchain-wallet-v4/src'

export const btcToLabel = curry((payment, state) => {
  const target = payment.to[0]
  switch (target.type) {
    case 'TO.ACCOUNT':
      return selectors.core.wallet.getAccountLabel(state)(target.accountIndex)
    case 'TO.ADDRESS':
      let label = selectors.core.wallet.getLegacyAddressLabel(state)(target.address)
      return label || target.address
    default:
      return target.address
  }
})

export const btcFromLabel = curry((payment, state) => {
  switch (payment.fromType) {
    case 'FROM.ACCOUNT':
      return selectors.core.wallet.getAccountLabel(state)(payment.fromAccountIdx)
    case 'FROM.LEGACY':
      return selectors.core.wallet.getLegacyAddressLabel(state)(payment.from[0])
    case 'FROM.WATCH_ONLY':
    case 'FROM.EXTERNAL':
    default:
      return payment.from[0]
  }
})

export const isBchLegacyAddress = curry((payment, state) => {
  const target = payment.to[0]
  return target.type === 'TO.ADDRESS' && !utils.bch.isCashAddr(target.address)
})

export const bchToLabel = curry((payment, state) => {
  const target = payment.to[0]
  switch (target.type) {
    case 'TO.ACCOUNT':
      return selectors.core.kvStore.bch.getAccountLabel(state)(target.accountIndex).getOrElse(target.address)
    default:
      return target.address
  }
})

export const bchFromLabel = curry((payment, state) => {
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
})

export const ethFromLabel = curry((payment, state) => {
  const from = payment.from
  switch (from.type) {
    case 'ACCOUNT':
      return selectors.core.kvStore.ethereum.getAccountLabel(state, from.address).getOrElse(from.address)
    default:
      return from.address
  }
})
