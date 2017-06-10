import { compose, map } from 'ramda'
import { Wallet, Wrapper, HDAccount, Address } from '../../types'

const ImtoJS = i => i.toJS()
export const getWalletContext = compose(ImtoJS, Wallet.selectContext, Wrapper.selectWallet)
export const getAddressContext = compose(ImtoJS, Wallet.selectAddrContext, Wrapper.selectWallet)
export const getXpubsContext = compose(ImtoJS, Wallet.selectXpubsContext, Wrapper.selectWallet)
export const getSharedKey = compose(Wallet.selectSharedKey, Wrapper.selectWallet)
export const getAddresses = compose(ImtoJS, map(Address.toJS), Wallet.selectAddresses, Wrapper.selectWallet)
export const getHDAccounts = compose(ImtoJS, map(HDAccount.toJS), Wallet.selectHDAccounts, Wrapper.selectWallet)

