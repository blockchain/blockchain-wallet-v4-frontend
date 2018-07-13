import { Wallet, HDWallet, HDAccountList, HDAccount, TXNotes } from '../../../types'
import { keys, compose, assoc, isNil, map, max, path, prop, curry, split, values, sequence, lift } from 'ramda'
import { getAddresses, getChangeIndex, getReceiveIndex, getHeight, getTransactions } from '../../data/bitcoin/selectors.js'
import { getAddressLabel, getMetadata } from '../../kvStore/btc/selectors'
import { getBuySellTxHashMatch } from '../../kvStore/buySell/selectors'
import { getShapeshiftTxHashMatch } from '../../kvStore/shapeShift/selectors'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import Remote from '../../../remote'

const transformTx = transactions.bitcoin.transformTx

const _getAccounts = selector => state => {
  const balancesR = getAddresses(state)
  const addInfo = account => balancesR
    .map(prop(prop('xpub', account)))
    .map(x => assoc('info', x, account))
  const accountsR = map(addInfo, selector(state))
  return sequence(Remote.of, accountsR)
}

// getHDAccounts :: state -> Remote ([hdAccountsWithInfo])
export const getHDAccounts = state => {
  let selector = compose(
    HDAccountList.toJSwithIndex,
    HDWallet.selectAccounts,
    walletSelectors.getDefaultHDWallet)
  return _getAccounts(selector)(state)
}

// getActiveHDAccounts :: state -> Remote ([hdAccountsWithInfo])
export const getActiveHDAccounts = state => {
  let selector = compose(
    HDAccountList.toJSwithIndex,
    HDAccountList.selectActive,
    HDWallet.selectAccounts,
    walletSelectors.getDefaultHDWallet)
  return _getAccounts(selector)(state)
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

const flattenAccount = acc => ({
  coin: 'BTC',
  label: prop('label', acc) ? prop('label', acc) : prop('xpub', acc),
  balance: path(['info', 'final_balance'], acc),
  xpub: prop('xpub', acc),
  index: prop('index', acc)
})

// getAccountsBalances :: state => Remote([])
export const getAccountsBalances = state =>
  map(map(flattenAccount), getHDAccounts(state))

// getActiveAccountsBalances :: state => Remote([])
export const getActiveAccountsBalances = state =>
  map(map(flattenAccount), getActiveHDAccounts(state))

const flattenAddress = addr => ({
  coin: 'BTC',
  label: prop('label', addr) ? prop('label', addr) : prop('addr', addr),
  balance: path(['info', 'final_balance'], addr),
  address: prop('addr', addr),
  watchOnly: compose(isNil, prop('priv'))(addr)
})

// TODO :: (rename that shit) getAddressesBalances :: state => Remote([])
export const getAddressesBalances = state => {
  return map(map(flattenAddress), getActiveAddresses(state))
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
export const getWalletTransactions = state => {
  // Page == Remote ([Tx])
  // Remote(wallet)
  const wallet = walletSelectors.getWallet(state)
  const walletR = Remote.of(wallet)
  // Remote(blockHeight)
  const blockHeightR = getHeight(state)
  // [Remote([tx])] == [Page] == Pages
  const getDescription = (hash, to) => TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet)) || getAddressLabel(to, state).getOrElse('')

  const getPartnerLabel = hash => getShapeshiftTxHashMatch(state, hash) || getBuySellTxHashMatch(state, hash)

  const pages = getTransactions(state)
  // Remote(metadata)
  getMetadata(state)

  // transformTx :: wallet -> blockHeight -> Tx
  // ProcessPage :: wallet -> blockHeight -> [Tx] -> [Tx]
  const ProcessTxs = (wallet, block, txList) =>
    map(transformTx.bind(undefined, wallet, block, getDescription, getPartnerLabel), txList)
  // ProcessRemotePage :: Page -> Page
  const ProcessPage = lift(ProcessTxs)(walletR, blockHeightR)
  return map(ProcessPage, pages)
}

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

export const getNextAvailableReceiveIndex = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), walletSelectors.getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = getReceiveIndex(xpub)(state)
  const labels = HDAccount.selectAddressLabels(account)
  const maxLabel = labels.maxBy((label) => label.index)
  const maxLabelIndex = maxLabel ? maxLabel.index : -1
  return index.map(x => max(x - 1, maxLabelIndex) + 1)
})

export const getNextAvailableReceiveAddress = curry((network, accountIndex, state) => {
  const receiveIndex = getNextAvailableReceiveIndex(network, accountIndex, state)
  return receiveIndex.map(x => getAddress(network, `${accountIndex}/${0}/${x}`, state))
})
