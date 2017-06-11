import { Wrapper, Wallet, HDWallet, HDAccount, Address } from '../../types'
import { prop, compose, assoc, map, filter, path, head, reduce } from 'ramda'
import * as addressesSelectors from '../data/Addresses/selectors.js'

export const commonSelectorsFactory = ({walletPath, dataPath, settingsPath}) => {

  // getActiveHDAccounts :: state -> [hdacountsWithInfo]
  const getActiveHDAccounts = state => {
    const balances = compose(addressesSelectors.getBalances, prop(dataPath))(state)
    const accounts = compose(HDWallet.selectAccounts, Wallet.selectHdWallet, Wrapper.selectWallet, prop(walletPath))(state)
    const activeAccounts = filter(HDAccount.isActive, accounts)
    const activeAccountsJS = map(HDAccount.toJS, activeAccounts).toJS()
    const addInfo = account => assoc('info', prop(prop('xpub', account), balances), account)
    return map(addInfo, activeAccountsJS)
  }

  // getActiveAddresses :: state -> [AddresseswithInfo]
  const getActiveAddresses = state => {
    const balances = compose(addressesSelectors.getBalances, prop(dataPath))(state)
    const addresses = compose(Wallet.selectAddresses, Wrapper.selectWallet, prop(walletPath))(state)
    const activeAddresses = filter(Address.isActive, addresses)
    const activeAddressesJS = map(Address.toJS, activeAddresses).toJS()
    const addInfo = address => assoc('info', prop(prop('addr', address), balances), address)
    return map(addInfo, activeAddressesJS)
  }

  // maybe this should stay in the frontend
  const getLabelBalances = state => {
    const as = getActiveHDAccounts(state)
      // .concat(getActiveAddresses(state)) // show each legacy as an account
    const digest = x => ({
      title: prop('label', x),
      amount: path(['info', 'final_balance'], x)
    })
    const ls = map(digest, getActiveAddresses(state))
    const adder = (a, b) => ({amount: (a.amount + b.amount)})
    const importedAddresses = assoc('title', 'Imported Addresses', reduce(adder, {amount: 0}, ls))

    return map(digest, as).concat([importedAddresses])
  }
  return {
    getActiveHDAccounts: getActiveHDAccounts,
    getActiveAddresses: getActiveAddresses,
    getLabelBalances: getLabelBalances
  }
}
