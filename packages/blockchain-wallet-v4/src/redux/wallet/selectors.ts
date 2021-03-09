import { always, compose, curry, ifElse, isNil, map, prop } from 'ramda'

import {
  Address,
  AddressMap,
  HDAccount,
  HDWallet,
  HDWalletList,
  Options,
  Wallet,
  Wrapper
} from '../../types'
import { walletPath } from '../paths'

const ImtoJS = i => i.toJS()
export const getWrapper = prop(walletPath)
export const getWallet = compose(Wrapper.selectWallet, getWrapper)
export const getDefaultHDWallet = compose(
  HDWalletList.selectHDWallet,
  Wallet.selectHdWallets,
  getWallet
)
export const getWalletContext = compose(ImtoJS, Wallet.selectContext, getWallet)
export const getContext = compose(ImtoJS, Wallet.selectContext, getWallet)
export const getSpendableContext = compose(
  ImtoJS,
  Wallet.selectSpendableContext,
  getWallet
)
export const getSpendableAddrContext = compose(
  ImtoJS,
  Wallet.selectSpendableAddrContext,
  getWallet
)
export const getAddressContext = compose(
  ImtoJS,
  Wallet.selectAddrContext,
  getWallet
)
export const getXpubsContext = compose(
  ImtoJS,
  Wallet.selectXpubsContext,
  getWallet
)
export const getSharedKey = compose(Wallet.selectSharedKey, getWallet)
export const getGuid = compose(Wallet.selectGuid, getWallet)
export const getAddresses = compose(
  ImtoJS,
  map(Address.toJS),
  Wallet.selectAddresses,
  getWallet
)
export const getActiveAddresses = compose(
  ImtoJS,
  map(Address.toJS),
  AddressMap.selectActive,
  Wallet.selectAddresses,
  getWallet
)
export const getArchivedAddresses = compose(
  ImtoJS,
  map(Address.toJS),
  AddressMap.selectArchived,
  Wallet.selectAddresses,
  getWallet
)
export const getHDAccounts = compose(
  ImtoJS,
  map(HDAccount.toJSwithIndex),
  Wallet.selectHDAccounts,
  getWallet
)
export const getSeedHex = curry((state, password) =>
  compose(Wallet.getSeedHex(password), getWallet)(state)
)
export const getMnemonic = curry((state, password) =>
  compose(Wallet.getMnemonic(password), getWallet)(state)
)
export const getDefaultAccount = compose(
  HDWallet.selectDefaultAccount,
  getDefaultHDWallet
)
export const getDefaultAccountIndex = compose(
  HDWallet.selectDefaultAccountIdx,
  getDefaultHDWallet
)
export const getAccount = curry((index, state) =>
  compose(HDWallet.selectAccount(index), getDefaultHDWallet)(state)
)
export const getAccountXpub = curry((index, state) =>
  compose(
    HDAccount.selectXpub,
    HDWallet.selectAccount(index),
    getDefaultHDWallet
  )(state)
)
export const getAccountLabel = curry((state, index) =>
  compose(
    HDAccount.selectLabel,
    HDWallet.selectAccount(index),
    getDefaultHDWallet
  )(state)
)
export const getLegacyAddressLabel = curry((state, address) =>
  compose(
    ifElse(isNil, always(undefined), Address.selectLabel),
    AddressMap.selectAddress(address),
    Wallet.selectAddresses,
    getWallet
  )(state)
)
export const getDefaultAccountXpub = state =>
  getAccountXpub(getDefaultAccountIndex(state), state)
export const getInitialSocketContext = state => ({
  guid: getGuid(state),
  addresses: getAddressContext(state),
  xpubs: getWalletContext(state)
})
export const getLogoutTime = compose(
  Options.selectLogoutTime,
  Wallet.selectOptions,
  getWallet
)
export const isSecondPasswordOn = compose(Wallet.isDoubleEncrypted, getWallet)
export const isMnemonicVerified = compose(
  HDWallet.selectMnemonicVerified,
  getDefaultHDWallet
)
export const getMainPassword = compose(Wrapper.selectPassword, getWrapper)
export const getPbkdf2Iterations = compose(
  Wrapper.selectPbkdf2Iterations,
  getWrapper
)
export const isHdWallet = compose(
  // @ts-ignore
  wallets => wallets.size > 0,
  Wallet.selectHdWallets,
  getWallet
)
export const getSpendableActiveAddresses = compose(
  Wallet.getSpendableActiveAddresses,
  getWallet
)
export const getAddress = curry((address, state) =>
  compose(Wallet.getAddress(address), getWallet)(state)
)
export const shouldSyncPubKeys = compose(Wrapper.selectSyncPubKeys, getWrapper)
