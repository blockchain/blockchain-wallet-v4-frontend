import { HDWallet, HDAccountList, HDAccount } from '../../../types'
import { prop, compose, assoc, map, path, curry, split, values, sequence } from 'ramda'
import memoize from 'fast-memoize'
import * as bitcoinSelectors from '../../data/bitcoin/selectors.js'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import Remote from '../../../remote'

const mTransformTx = memoize(transactions.bitcoin.transformTx)

// getActiveHDAccounts :: state -> Remote ([hdacountsWithInfo])
export const getActiveHDAccounts = state => {
  const balancesRD = bitcoinSelectors.getAddresses(state)
  const addInfo = account => balancesRD.map(prop(prop('xpub', account)))
                                       .map(x => assoc('info', x, account))
  const objectOfRemotes = compose(map(addInfo), HDAccountList.toJSwithIndex, HDAccountList.selectActive, HDWallet.selectAccounts, walletSelectors.getDefaultHDWallet)(state)
  return sequence(Remote.of, objectOfRemotes)
}

// getActiveAddresses :: state -> Remote ([AddresseswithInfo])
export const getActiveAddresses = state => {
  const balancesRD = bitcoinSelectors.getAddresses(state)
  const addInfo = address => balancesRD.map(prop(prop('addr', address)))
                                       .map(x => assoc('info', x, address))
  const objectOfRemotes = compose(map(addInfo), values, walletSelectors.getActiveAddresses)(state)
  return sequence(Remote.of, objectOfRemotes)
}

const digestAddress = x => ({
  coin: 'BTC',
  label: prop('label', x) ? prop('label', x) : prop('addr', x),
  balance: path(['info', 'final_balance'], x),
  address: prop('addr', x)
})

const digestAccount = x => ({
  coin: 'BTC',
  label: prop('label', x) ? prop('label', x) : prop('xpub', x),
  balance: path(['info', 'final_balance'], x),
  xpub: prop('xpub', x),
  index: prop('index', x)
})

export const getAccountsBalances = state => map(map(digestAccount), getActiveHDAccounts(state))

export const getAddressesBalances = state => map(map(digestAddress), getActiveAddresses(state))

// export const getAggregatedAddressesBalances = state => {
//   const ls = getAddressesBalances(state)
//   const adder = (a, b) => ({ amount: (a.amount + b.amount) })
//   return assoc('label', 'Imported Addresses', reduce(adder, { amount: 0 }, ls))
// }

// // search :: String -> Object -> Boolean
// const isOfType = curry((filter, tx) =>
//   propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
// // search :: String -> String -> Object -> Boolean
// const search = curry((text, property, tx) =>
//   compose(contains(toUpper(text)), toUpper, prop(property))(tx))

// walletSelectors.getWalletTransactions :: state -> [Tx]
export const getWalletTransactions = memoize(state => {
  const wallet = walletSelectors.getWallet(state)
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
  const account = compose(HDWallet.selectAccount(accId), walletSelectors.getDefaultHDWallet)(state)
  return HDAccount.getAddress(account, `M/${chain}/${index}`, network)
})

export const getNextAvailableChangeAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), walletSelectors.getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = bitcoinSelectors.getChangeIndex(xpub)(state)
  return getAddress(network, `${accountIndex}/${1}/${index}`, state)
})

export const getNextAvailableReceiveAddress = curry((network, accountIndex, state) => {
  const account = compose(HDWallet.selectAccount(accountIndex), walletSelectors.getDefaultHDWallet)(state)
  const xpub = HDAccount.selectXpub(account)
  const index = bitcoinSelectors.getReceiveIndex(xpub)(state)
  return getAddress(network, `${accountIndex}/${0}/${index}`, state)
})
