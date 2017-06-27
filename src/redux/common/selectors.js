import { Wrapper, Wallet, HDWallet, HDWalletList, HDAccountList, AddressMap } from '../../types'
import { allPass, anyPass, contains, prop, compose, assoc, map, path, reduce, propSatisfies, toUpper, curry, filter } from 'ramda'
import { getBalances } from '../data/Addresses/selectors.js'
import { getTransactions, getTypeFilter, getSearchFilter } from '../data/Transactions/selectors.js'
import { getHeight } from '../data/LatestBlock/selectors.js'
import { transformTx } from '../services/transactions.js'
// ---------------------------------------------------------------------------------------------
export const commonSelectorsFactory = ({walletPath, dataPath, settingsPath}) => {
  // getActiveHDAccounts :: state -> [hdacountsWithInfo]
  const getActiveHDAccounts = state => {
    const balances = compose(getBalances, prop(dataPath))(state)
    const addInfo = account => assoc('info', prop(prop('xpub', account), balances), account)
    return compose(map(addInfo), HDAccountList.toJS, HDAccountList.selectActive, HDWallet.selectAccounts,
                   HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet, prop(walletPath))(state)
  }
  // getActiveAddresses :: state -> [AddresseswithInfo]
  const getActiveAddresses = state => {
    const balances = compose(getBalances, prop(dataPath))(state)
    const addInfo = address => assoc('info', prop(prop('addr', address), balances), address)
    return compose(map(addInfo), AddressMap.toJS, AddressMap.selectActive,
                   Wallet.selectAddresses, Wrapper.selectWallet, prop(walletPath))(state)
  }
  const digest = x => ({
    title: prop('label', x) ? prop('label', x) : x.addr || x.xpub,
    amount: path(['info', 'final_balance'], x),
    address: x.addr || x.xpub
  })

  const getAccountsBalances = state => map(digest, getActiveHDAccounts(state))
  const getAddressesBalances = state => map(digest, getActiveAddresses(state))
  const getAggregatedAddressesBalances = state => {
    const ls = getAddressesBalances(state)
    const adder = (a, b) => ({amount: (a.amount + b.amount)})
    return assoc('title', 'Imported Addresses', reduce(adder, {amount: 0}, ls))
  }

  // search :: String -> Object -> Boolean
  const isOfType = curry((filter, tx) =>
    propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  // search :: String -> String -> Object -> Boolean
  const search = curry((text, property, tx) =>
    compose(contains(toUpper(text)), toUpper, prop(property))(tx))

  // getWalletTransactions :: state -> [Tx]
  const getWalletTransactions = state => {
    const wallet = compose(Wrapper.selectWallet, prop(walletPath))(state)
    const currentBlockHeight = compose(getHeight, prop(dataPath))(state)
    const typeFilter = compose(getTypeFilter, prop(dataPath))(state)
    const searchFilter = compose(getSearchFilter, prop(dataPath))(state)
    const searchPredicate = anyPass(map(search(searchFilter), ['description', 'from', 'to']))
    const fullPredicate = allPass([isOfType(typeFilter), searchPredicate])

    return compose(filter(fullPredicate),
                   map(transformTx(wallet, currentBlockHeight)),
                   getTransactions,
                   prop(dataPath))(state)
  }
  return {
    getActiveHDAccounts: getActiveHDAccounts,
    getActiveAddresses: getActiveAddresses,
    getAccountsBalances: getAccountsBalances,
    getAddressesBalances: getAddressesBalances,
    getAggregatedAddressesBalances: getAggregatedAddressesBalances,
    getWalletTransactions: getWalletTransactions
  }
}
