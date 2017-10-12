import { Wrapper, Wallet, HDWallet, HDWalletList, HDAccountList, AddressMap, HDAccount } from '../../types'
import { prop, compose, assoc, map, path, reduce, curry, split } from 'ramda'
import memoize from 'fast-memoize'
import { getBalances, getChangeIndex, getReceiveIndex } from '../data/addresses/selectors.js'
import { getTransactions } from '../data/transactions/selectors.js'
import { getHeight } from '../data/latestBlock/selectors.js'
import { transformTx } from '../services/transactions.js'
const mTransformTx = memoize(transformTx)
// ---------------------------------------------------------------------------------------------
export const commonSelectorsFactory = ({walletPath, dataPath, settingsPath}) => {
  // getActiveHDAccounts :: state -> [hdacountsWithInfo]
  const getActiveHDAccounts = state => {
    const balances = compose(getBalances, prop(dataPath))(state)
    const addInfo = account => assoc('info', prop(prop('xpub', account), balances), account)
    return compose(map(addInfo), HDAccountList.toJSwithIndex, HDAccountList.selectActive, HDWallet.selectAccounts,
                   HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet, prop(walletPath))(state)
  }
  // getActiveAddresses :: state -> [AddresseswithInfo]
  const getActiveAddresses = state => {
    const balances = compose(getBalances, prop(dataPath))(state)
    const addInfo = address => assoc('info', prop(prop('addr', address), balances), address)
    return compose(map(addInfo), AddressMap.toJS, AddressMap.selectActive,
                   Wallet.selectAddresses, Wrapper.selectWallet, prop(walletPath))(state)
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

  const getAccountsBalances = state => map(digestAccount, getActiveHDAccounts(state))
  const getAddressesBalances = state => map(digestAddress, getActiveAddresses(state))

  const getAggregatedAddressesBalances = state => {
    const ls = getAddressesBalances(state)
    const adder = (a, b) => ({amount: (a.amount + b.amount)})
    return assoc('title', 'Imported Addresses', reduce(adder, {amount: 0}, ls))
  }

  // // search :: String -> Object -> Boolean
  // const isOfType = curry((filter, tx) =>
  //   propSatisfies(x => filter === '' || toUpper(x) === toUpper(filter), 'type', tx))
  // // search :: String -> String -> Object -> Boolean
  // const search = curry((text, property, tx) =>
  //   compose(contains(toUpper(text)), toUpper, prop(property))(tx))

  // getWalletTransactions :: state -> [Tx]
  const getWalletTransactions = state => {
    const wallet = compose(Wrapper.selectWallet, prop(walletPath))(state)
    const currentBlockHeight = compose(getHeight, prop(dataPath))(state)
    // const typeFilter = compose(getTypeFilter, prop(dataPath))(state)
    // const searchFilter = compose(getSearchFilter, prop(dataPath))(state)
    // const searchPredicate = anyPass(map(search(searchFilter), ['description', 'from', 'to']))
    // const fullPredicate = allPass([isOfType(typeFilter), searchPredicate])

    return compose( // filter(fullPredicate),
                   map(mTransformTx.bind(undefined, wallet, currentBlockHeight)),
                   getTransactions,
                   prop(dataPath))(state)
  }

  // path is: accountIndex/chainIndex/addressIndex
  const getAddress = curry((network, path, state) => {
    const [a, c, i] = split('/', path)
    const accId = parseInt(a)
    const chain = parseInt(c)
    const index = parseInt(i)
    const account = compose(HDWallet.selectAccount(accId), HDWalletList.selectHDWallet,
                            Wallet.selectHdWallets, Wrapper.selectWallet, prop(walletPath))(state)
    return HDAccount.getAddress(account, `M/${chain}/${index}`, network)
  })

  const getNextAvailableChangeAddress = curry((network, accountIndex, state) => {
    const account = compose(HDWallet.selectAccount(accountIndex), HDWalletList.selectHDWallet,
                            Wallet.selectHdWallets, Wrapper.selectWallet, prop(walletPath))(state)
    const xpub = HDAccount.selectXpub(account)
    const index = compose(getChangeIndex(xpub), prop(dataPath))(state)
    return getAddress(network, `${accountIndex}/${1}/${index}`, state)
  })

  const getNextAvailableReceiveAddress = curry((network, accountIndex, state) => {
    const account = compose(HDWallet.selectAccount(accountIndex), HDWalletList.selectHDWallet,
                            Wallet.selectHdWallets, Wrapper.selectWallet, prop(walletPath))(state)
    const xpub = HDAccount.selectXpub(account)
    const index = compose(getReceiveIndex(xpub), prop(dataPath))(state)
    return getAddress(network, `${accountIndex}/${0}/${index}`, state)
  })

  return {
    getActiveHDAccounts: getActiveHDAccounts,
    getActiveAddresses: getActiveAddresses,
    getAccountsBalances: getAccountsBalances,
    getAddressesBalances: getAddressesBalances,
    getAggregatedAddressesBalances: getAggregatedAddressesBalances,
    getWalletTransactions: memoize(getWalletTransactions),
    getNextAvailableChangeAddress: getNextAvailableChangeAddress,
    getNextAvailableReceiveAddress: getNextAvailableReceiveAddress,
    getAddress: getAddress
  }
}
