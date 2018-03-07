import { HDWallet, HDAccountList, HDAccount } from '../../../types'
import { prop, keys, compose, assoc, map, path, curry, split, values, sequence, lift } from 'ramda'
import memoize from 'fast-memoize'
import { getAddresses, getChangeIndex, getReceiveIndex, getHeight, getTransactions } from '../../data/bitcoin/selectors.js'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import Remote from '../../../remote'

const mTransformTx = memoize(transactions.bitcoin.transformTx)

// getActiveHDAccounts :: state -> Remote ([hdacountsWithInfo])
export const getActiveHDAccounts = state => {
  const balancesRD = getAddresses(state)
  const addInfo = account => balancesRD.map(prop(prop('xpub', account)))
    .map(x => assoc('info', x, account))
  const objectOfRemotes = compose(map(addInfo), HDAccountList.toJSwithIndex, HDWallet.selectAccounts, walletSelectors.getDefaultHDWallet)(state)
  return sequence(Remote.of, objectOfRemotes)
}

// getActiveAddresses :: state -> Remote ([AddresseswithInfo])
export const getActiveAddresses = state => {
  const balancesRD = getAddresses(state)
  const addInfo = address => balancesRD.map(prop(prop('addr', address)))
    .map(x => assoc('info', x, address))
  const objectOfRemotes = compose(map(addInfo), values, walletSelectors.getActiveAddresses)(state)
  return sequence(Remote.of, objectOfRemotes)
}

export const getArchivedAddresses = state => {
  const archivedAddresses = compose(keys, walletSelectors.getArchivedAddresses)(state)
  return Remote.of(archivedAddresses)
}
// getAccountsBalances :: state => Remote([])
export const getAccountsBalances = state => {
  const digest = x => ({
    coin: 'BTC',
    label: prop('label', x) ? prop('label', x) : prop('xpub', x),
    balance: path(['info', 'final_balance'], x),
    xpub: prop('xpub', x),
    index: prop('index', x)
  })
  return map(map(digest), getActiveHDAccounts(state))
}
// getAddressesBalances :: state => Remote([])
export const getAddressesBalances = state => {
  const digest = x => ({
    coin: 'BTC',
    label: prop('label', x) ? prop('label', x) : prop('addr', x),
    balance: path(['info', 'final_balance'], x),
    address: prop('addr', x)
  })
  return map(map(digest), getActiveAddresses(state))
}
// getAccountsInfo :: state => []
export const getAccountsInfo = state => {
  const hdAccounts = compose(HDAccountList.toJSwithIndex, HDAccountList.selectActive, HDWallet.selectAccounts, walletSelectors.getDefaultHDWallet)(state)
  const digest = x => ({
    coin: 'BTC',
    label: prop('label', x) ? prop('label', x) : prop('xpub', x),
    xpub: prop('xpub', x),
    index: prop('index', x)
  })
  return map(digest, hdAccounts)
}
// getAddressesInfo :: state => []
export const getAddressesInfo = state => {
  const legacyAddresses = compose(values, walletSelectors.getActiveAddresses)(state)
  const digest = x => ({
    coin: 'BTC',
    label: prop('label', x) ? prop('label', x) : prop('addr', x),
    address: prop('addr', x)
  })
  return map(digest, legacyAddresses)
}

// getWalletTransactions :: state -> [Page]
export const getWalletTransactions = memoize(state => {
  // Page == Remote ([Tx])
  // Remote(wallet)
  const walletR = Remote.of(walletSelectors.getWallet(state))
  // Remote(blockHeight)
  const blockHeightR = getHeight(state)
  // [Remote([tx])] == [Page] == Pages
  const pages = getTransactions(state)
  // mTransformTx :: wallet -> blockHeight -> Tx
  // ProcessPage :: wallet -> blockHeight -> [Tx] -> [Tx]
  const ProcessTxs = (wallet, block, txList) =>
    map(mTransformTx.bind(undefined, wallet, block), txList)
  // ProcessRemotePage :: Page -> Page
  const ProcessPage = lift(ProcessTxs)(walletR, blockHeightR)
  return map(ProcessPage, pages)
})

// path is: accountIndex/chainIndex/addressIndex
const getAddress = curry((network, path, state) => {
  const [a, c, i] = split('/', path)
  const accId = parseInt(a)
  const chain = parseInt(c)
  const index = parseInt(i)
  const account = compose(HDWallet.selectAccount(accId), walletSelectors.getDefaultHDWallet)(state)
  return HDAccount.getAddress(account, `M/${chain}/${index}`, network)
})

export const getNextAvailableChangeAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), walletSelectors.getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = getChangeIndex(xpub)(state)
  return index.map(x => getAddress(network, `${accountIndex}/${1}/${x}`, state))
})

export const getNextAvailableReceiveAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), walletSelectors.getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = getReceiveIndex(xpub)(state)
  return index.map(x => getAddress(network, `${accountIndex}/${0}/${x}`, state))
})
