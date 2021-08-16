import {
  assoc,
  compose,
  curry,
  isNil,
  keys,
  lensProp,
  lift,
  map,
  max,
  path,
  pipe,
  pluck,
  prop,
  propEq,
  propOr,
  reject,
  sequence,
  split,
  sum,
  values
} from 'ramda'
import { set } from 'ramda-lens'

import Remote from '../../../remote'
import { HDAccount, HDAccountList, HDWallet } from '../../../types'
import { getAddresses, getChangeIndex, getReceiveIndex } from '../../data/btc/selectors'
import { getLockboxBtcAccount, getLockboxBtcAccounts } from '../../kvStore/lockbox/selectors'
import { ADDRESS_TYPES } from '../../payment/btc/utils'
import * as walletSelectors from '../../wallet/selectors'

const _getAccounts = (selector) => (state) => {
  const balances = Remote.of(getAddresses(state).getOrElse({}))
  const addInfo = (account) => {
    const derivationsInfo = map(
      (d) => assoc('info', propOr({}, d.xpub, balances.getOrElse({})), d),
      prop('derivations', account)
    )
    return set(lensProp('derivations'), derivationsInfo, account)
  }
  return Remote.of(map(addInfo, selector(state)))
}

// default derivation type ('legacy' or 'bech32')
export const getAccountDefaultDerivation = curry((accountIndex, state) => {
  const account = compose(
    HDWallet.selectAccount(accountIndex),
    walletSelectors.getDefaultHDWallet
  )(state)
  return HDAccount.selectDefaultDerivation(account)
})

// getHDAccounts :: state -> Remote ([hdAccountsWithInfo])
export const getHDAccounts = (state) => {
  const selector = compose(
    HDAccountList.toJSwithIndex,
    HDWallet.selectAccounts,
    walletSelectors.getDefaultHDWallet
  )
  return _getAccounts(selector)(state)
}

// getActiveHDAccounts :: state -> Remote ([hdAccountsWithInfo])
export const getActiveHDAccounts = (state) => {
  const selector = compose(
    HDAccountList.toJSwithIndex,
    HDAccountList.selectActive,
    HDWallet.selectAccounts,
    walletSelectors.getDefaultHDWallet
  )
  return _getAccounts(selector)(state)
}

// imported addresses
// getActiveAddresses :: state -> Remote ([AddressesWithInfo])
export const getActiveAddresses = (state) => {
  const balancesRD = getAddresses(state)
  const addInfo = (address) =>
    balancesRD.map(prop(prop('addr', address))).map((x) => assoc('info', x, address))
  const objectOfRemotes = compose(map(addInfo), values, walletSelectors.getActiveAddresses)(state)
  return sequence(Remote.of, objectOfRemotes)
}

// archived imported addresses
export const getArchivedAddresses = (state) => {
  const archivedAddresses = compose(keys, walletSelectors.getArchivedAddresses)(state)
  return Remote.of(archivedAddresses)
}

const flattenAccount = (acc) => {
  return {
    balance: pipe(
      prop('derivations'),
      pluck('info'),
      pluck('final_balance'),
      reject(isNil),
      sum
    )(acc),
    coin: 'BTC',
    derivations: prop('derivations', acc),
    index: prop('index', acc),
    label: prop('label', acc) ? prop('label', acc) : prop('xpub', acc),
    network: prop('network', acc),
    type: ADDRESS_TYPES.ACCOUNT,
    xpub: prop(
      'xpub',
      acc.derivations.find(propEq('type', HDAccount.selectDefaultDerivation(HDAccount.fromJS(acc))))
    )
  }
}

// getAccountsBalances :: state => Remote([])
export const getAccountsBalances = (state) => map(map(flattenAccount), getHDAccounts(state))

export const getLockboxBtcBalances = (state) => {
  const digest = (addresses, account) => {
    const xpub = prop('xpub', account.derivations.find(propEq('type', 'legacy')))
    return {
      address: xpub,
      balance: path([xpub, 'final_balance'], addresses),
      coin: 'BTC',
      label: account.label,
      type: ADDRESS_TYPES.LOCKBOX,
      xpub
    }
  }
  const balances = Remote.of(getAddresses(state).getOrElse([]))
  return map(lift(digest)(balances), getLockboxBtcAccounts(state))
}
// getActiveAccountsBalances :: state => Remote([])
export const getActiveAccountsBalances = (state) =>
  map(map(flattenAccount), getActiveHDAccounts(state))

const flattenAddress = (addr) => ({
  address: prop('addr', addr),
  balance: path(['info', 'final_balance'], addr),
  coin: 'BTC',
  label: prop('label', addr) ? prop('label', addr) : prop('addr', addr),
  type: ADDRESS_TYPES.LEGACY
})

// getAddressesBalances :: state => Remote([])
export const getAddressesBalances = (state) => {
  return map(map(flattenAddress), getActiveAddresses(state))
}

// getAccountsInfo :: state => []
export const getAccountsInfo = (state) => {
  const hdAccounts = compose(
    HDAccountList.toJSwithIndex,
    HDAccountList.selectActive,
    HDWallet.selectAccounts,
    walletSelectors.getDefaultHDWallet
  )(state)
  const digest = (x) => ({
    coin: 'BTC',
    index: prop('index', x),
    label: prop('label', x) ? prop('label', x) : prop('xpub', x),
    xpub: prop('xpub', x)
  })
  return map(digest, hdAccounts)
}
// getAddressesInfo :: state => []
export const getAddressesInfo = (state) => {
  const legacyAddresses = compose(values, walletSelectors.getActiveAddresses)(state)
  const digest = (x) => ({
    address: prop('addr', x),
    coin: 'BTC',
    label: prop('label', x) ? prop('label', x) : prop('addr', x),
    type: ADDRESS_TYPES.LEGACY
  })
  return map(digest, legacyAddresses)
}

// getWalletTransactions :: state -> [Page]
export const getWalletTransactions = (state) => state.dataPath.btc.transactions

// path is: accountIndex/chainIndex/addressIndex
const getAddress = curry((network, path, state) => {
  const [a, c, i] = split('/', path)
  const accId = parseInt(a)
  const chain = parseInt(c)
  const index = parseInt(i)
  const account = compose(HDWallet.selectAccount(accId), walletSelectors.getDefaultHDWallet)(state)
  return HDAccount.getAddress(account, `M/${chain}/${index}`, network)
})

export const getNextAvailableChangeAddress = curry((network, accountIndex, derivation, state) => {
  const account = compose(
    HDWallet.selectAccount(accountIndex),
    walletSelectors.getDefaultHDWallet
  )(state)
  const xpub = HDAccount.selectXpub(account, derivation)
  const index = getChangeIndex(xpub)(state)
  return index.map((x) => getAddress(network, `${accountIndex}/${1}/${x}`, state))
})

export const getNextAvailableReceiveIndex = curry((network, accountIndex, derivation, state) => {
  const account = compose(
    HDWallet.selectAccount(accountIndex),
    walletSelectors.getDefaultHDWallet
  )(state)
  const xpub = HDAccount.selectXpub(account, derivation)
  const index = getReceiveIndex(xpub)(state)
  const labels = HDAccount.selectAddressLabels(account, derivation)
  const maxLabel = labels.maxBy((label) => label.index)
  const maxLabelIndex = maxLabel ? maxLabel.index : -1
  return index.map((x) => max(x - 1, maxLabelIndex) + 1)
})

export const getNextAvailableReceiveAddress = curry((network, accountIndex, derivation, state) => {
  const receiveIndex = getNextAvailableReceiveIndex(network, accountIndex, derivation, state)
  return receiveIndex.map((x) => getAddress(network, `${accountIndex}/${0}/${x}`, state))
})

export const getNextAvailableReceiveIndexLockbox = curry((network, xpub, state) => {
  const index = getReceiveIndex(xpub)(state)
  // TODO(salome): implement btc address labels for lockbox.
  // const labels = getLockboxBtcAddressLabels(state).getOrElse([])
  // const maxLabel = labels.maxBy(label => label.index)
  // const maxLabelIndex = maxLabel ? maxLabel.index : -1
  // return index.map(x => max(x - 1, maxLabelIndex) + 1)
  return index
})

export const getNextAvailableReceiveAddressLockbox = curry((network, xpub, state) => {
  const receiveIndex = getNextAvailableReceiveIndexLockbox(network, xpub, state)
  return receiveIndex.map((x) => getAddressLockbox(network, xpub, x, state))
})

export const getAddressLockbox = curry((network, xpub, index, state) => {
  const account = getLockboxBtcAccount(state, xpub)
  const hdAccount = HDAccount.fromJS(account.getOrElse({}), 0)
  return HDAccount.getAddress(hdAccount, `M/0/${index}`, network)
})
