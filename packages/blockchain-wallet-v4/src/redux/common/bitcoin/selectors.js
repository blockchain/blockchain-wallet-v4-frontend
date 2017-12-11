import { Wallet, HDWallet, HDAccountList, AddressMap, HDAccount } from '../../../types'
import { prop, compose, assoc, map, path, reduce, curry, split } from 'ramda'
import memoize from 'fast-memoize'
import * as bitcoinSelectors from '../../data/bitcoin/selectors.js'
import * as transactions from '../../../transactions'
import { getDefaultHDWallet, getWallet } from '../../wallet/selectors'

const mTransformTx = memoize(transactions.bitcoin.transformTx)

// getActiveHDAccounts :: state -> [hdacountsWithInfo]
export const getActiveHDAccounts = state => {
  const balances = bitcoinSelectors.getAddresses(state)
  const addInfo = account => assoc('info', prop(prop('xpub', account), balances), account)
  return compose(map(addInfo), HDAccountList.toJSwithIndex, HDAccountList.selectActive, HDWallet.selectAccounts, getDefaultHDWallet)(state)
}
// getActiveAddresses :: state -> [AddresseswithInfo]
export const getActiveAddresses = state => {
  const balances = bitcoinSelectors.getAddresses(state)
  const addInfo = address => assoc('info', prop(prop('addr', address), balances), address)
  return compose(map(addInfo), AddressMap.toJS, AddressMap.selectActive, Wallet.selectAddresses, getWallet)(state)
}
const digestAddress = x => ({
  title: prop('label', x) ? prop('label', x) : prop('addr', x),
  amount: path(['info', 'final_balance'], x),
  address: prop('addr', x)
})

const digestAccount = x => ({
  title: prop('label', x) ? prop('label', x) : prop('xpub', x),
  amount: path(['info', 'final_balance'], x),
  xpub: prop('xpub', x),
  index: prop('index', x)
})

export const getAccountsBalances = state => map(digestAccount, getActiveHDAccounts(state))
export const getAddressesBalances = state => map(digestAddress, getActiveAddresses(state))

export const getAggregatedAddressesBalances = state => {
  const ls = getAddressesBalances(state)
  const adder = (a, b) => ({ amount: (a.amount + b.amount) })
  return assoc('title', 'Imported Addresses', reduce(adder, { amount: 0 }, ls))
}

// // search :: String -> Object -> Boolean
// const isOfType = curry((filter, tx) =>
//   propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
// // search :: String -> String -> Object -> Boolean
// const search = curry((text, property, tx) =>
//   compose(contains(toUpper(text)), toUpper, prop(property))(tx))

// getWalletTransactions :: state -> [Tx]
export const getWalletTransactions = memoize(state => {
  const wallet = getWallet(state)
  const currentBlockHeight = bitcoinSelectors.getHeight(state)
  return compose(
    map(mTransformTx.bind(undefined, wallet, currentBlockHeight)),
    bitcoinSelectors.getTransactions)(state)
})

// path is: accountIndex/chainIndex/addressIndex
const getAddress = curry((network, path, state) => {
  const [a, c, i] = split('/', path)
  const accId = parseInt(a)
  const chain = parseInt(c)
  const index = parseInt(i)
  const account = compose(HDWallet.selectAccount(accId), getDefaultHDWallet)(state)
  return HDAccount.getAddress(account, `M/${chain}/${index}`, network)
})

export const getNextAvailableChangeAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = bitcoinSelectors.getChangeIndex(xpub)(state)
  return getAddress(network, `${accountIndex}/${1}/${index}`, state)
})

export const getNextAvailableReceiveAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = bitcoinSelectors.getReceiveIndex(xpub)(state)
  return getAddress(network, `${accountIndex}/${0}/${index}`, state)
})
