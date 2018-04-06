import { HDWallet, HDAccountList, HDAccount } from '../../../types'
import { prop, compose, assoc, map, path, curry, split, values, sequence, lift, indexOf } from 'ramda'
import memoize from 'fast-memoize'
import { getAddresses, getChangeIndex, getReceiveIndex, getHeight, getTransactions } from '../../data/bch/selectors.js'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import Remote from '../../../remote'
import { getAccountsList } from '../../kvStore/bch/selectors.js'
import { toCashAddr } from '../../../utils/bch'
import { isValidBitcoinAddress } from '../../../utils/bitcoin'

const mTransformTx = memoize(transactions.bitcoin.transformTx)

// getActiveHDAccounts :: state -> Remote ([hdacountsWithInfo])
export const getActiveHDAccounts = state => {
  const balancesRD = getAddresses(state)
  const bchAccounts = getAccountsList(state).getOrElse([])
  const addInfo = account => balancesRD.map(prop(prop('xpub', account)))
    .map(x => assoc('info', x, account))
  const addBchLabel = account => account.map(a => assoc('label', prop('label', bchAccounts[prop('index', a)]), a))

  const objectOfRemotes = compose(map(addBchLabel), map(addInfo),
    HDAccountList.toJSwithIndex, HDWallet.selectAccounts, walletSelectors.getDefaultHDWallet)(state)

  return sequence(Remote.of, objectOfRemotes)
}

// getActiveAddresses :: state -> Remote ([AddresseswithInfo])
export const getActiveAddresses = state => {
  const balancesRD = getAddresses(state)
  const addInfo = address => balancesRD.map(prop(prop('addr', address)))
    .map(x => assoc('info', x, address))
  const convertToCashAddr = address => assoc('addr', toCashAddr(address.addr, true), address)

  const objectOfRemotes = compose(map(lift(convertToCashAddr)),
    map(addInfo), values, walletSelectors.getActiveAddresses)(state)

  return sequence(Remote.of, objectOfRemotes)
}

const digestAddress = (x) => ({
  coin: 'BCH',
  label: prop('label', x) ? prop('label', x) : prop('addr', x),
  balance: path(['info', 'final_balance'], x),
  address: prop('addr', x)
})

const digestAccount = x => ({
  coin: 'BCH',
  label: prop('label', x) ? prop('label', x) : prop('xpub', x),
  balance: path(['info', 'final_balance'], x),
  xpub: prop('xpub', x),
  index: prop('index', x)
})

export const getAccountsBalances = state => map(map(digestAccount), getActiveHDAccounts(state))

export const getAddressesBalances = state => map(map(digestAddress), getActiveAddresses(state))

export const getAccountsInfo = state => {
  const hdAccounts = compose(HDAccountList.toJSwithIndex, HDAccountList.selectActive, HDWallet.selectAccounts, walletSelectors.getDefaultHDWallet)(state)
  const accountsR = getAccountsList(state)
  const digest = x => {
    const index = indexOf(x, accountsR.getOrElse([]))
    const hdAccount = hdAccounts[index]
    return {
      coin: 'BCH',
      label: prop('label', x) ? prop('label', x) : prop('xpub', hdAccount),
      xpub: prop('xpub', hdAccount),
      index: prop('index', hdAccount)
    }
  }
  return accountsR.map(map(digest))
}

export const getAddressesInfo = state => {
  const legacyAddresses = compose(values, walletSelectors.getActiveAddresses)(state)
  const digest = x => ({
    coin: 'BCH',
    label: prop('addr', x),
    address: prop('addr', x)
  })
  return map(digest, legacyAddresses)
}

const addFromToBch = (wallet, bchAccounts, txList) => {
  const hdWallets = wallet.hd_wallets
  map(tx => hdWallets.map(hdWallet => hdWallet.accounts.map((account, index) => {
    if (account) {
      if (account.label === tx.from) {
        tx.from = bchAccounts[index].label
      } else if (isValidBitcoinAddress(tx.from)) {
        try { tx.from = toCashAddr(tx.from, true) } catch (e) {}
      }
      if (account.label === tx.to) {
        tx.to = bchAccounts[index].label
      } else if (isValidBitcoinAddress(tx.to)) {
        try { tx.to = toCashAddr(tx.to, true) } catch (e) {}
      }
    }
  })), txList)

  return txList
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
  const txs = map(ProcessPage, pages)
  return map(txListR => lift(addFromToBch)(walletR, getAccountsList(state), txListR), txs)
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
