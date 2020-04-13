import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { curry, prop, toLower } from 'ramda'
import { model, selectors } from 'data'
import { utils } from 'blockchain-wallet-v4/src'

export const btcToLabel = curry((payment, state) => {
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

export const btcFromLabel = curry((payment, state) => {
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

export const isBchLegacyAddress = curry(payment => {
  const target = payment.to[0]
  return (
    target.type === ADDRESS_TYPES.ADDRESS &&
    !utils.bch.isCashAddr(target.address)
  )
})

export const bchToLabel = curry((payment, state) => {
  const target = payment.to[0]
  switch (target.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.bch
        .getAccountLabel(state)(target.accountIndex)
        .getOrElse(target.address)
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxBchAccount(state, target.xpub)
        .map(prop('label'))
        .getOrElse(target.address)
    default:
      return target.address
  }
})

export const bchFromLabel = curry((payment, state) => {
  switch (payment.fromType) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.bch
        .getAccountLabel(state)(payment.fromAccountIdx)
        .getOrElse(payment.from[0])
    case ADDRESS_TYPES.CUSTODIAL:
      return payment.from
    case ADDRESS_TYPES.LEGACY:
      const formValues = selectors.form.getFormValues(
        model.components.sendBch.FORM
      )(state)
      const { from } = formValues
      if (from === 'allImportedAddresses') {
        return 'All Imported Bitcoin Cash Addresses'
      } else {
        return utils.bch.toCashAddr(payment.from[0], true)
      }
    case ADDRESS_TYPES.WATCH_ONLY:
      return utils.bch.toCashAddr(payment.from[0], true)
    case ADDRESS_TYPES.EXTERNAL:
      return utils.bch.toCashAddr(payment.from[0], true)
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxBchAccount(state, payment.from[0])
        .map(prop('label'))
        .getOrElse(payment.from[0])
    default:
      return payment.from[0]
  }
})

export const ethFromLabel = curry((payment, state) => {
  const from = payment.from
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.eth
        .getAccountLabel(state, from.address)
        .getOrElse(from.address)
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxEthAccount(state, from.address)
        .map(prop('label'))
        .getOrElse(from.address)
    default:
      return from.address
  }
})

export const erc20FromLabel = curry((coin, payment, state) => {
  const from = payment.from
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.eth
        .getErc20AccountLabel(state, toLower(coin))
        .getOrElse(from.address)
    default:
      return from.address
  }
})

export const xlmFromLabel = curry((payment, state) => {
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
