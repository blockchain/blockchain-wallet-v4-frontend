import { compose, map, curry } from 'ramda'
import Either from 'data.either'
import BIP39 from 'bip39'
import { Wallet
       , Wrapper
       , HDAccount
       , Address
       , HDWalletList
       , HDWallet
       , Options
      } from '../../types'

const entropyToMnemonic = Either.try(BIP39.entropyToMnemonic)

const ImtoJS = i => i.toJS()
export const getWalletContext = compose(ImtoJS, Wallet.selectContext, Wrapper.selectWallet)
export const getAddressContext = compose(ImtoJS, Wallet.selectAddrContext, Wrapper.selectWallet)
export const getXpubsContext = compose(ImtoJS, Wallet.selectXpubsContext, Wrapper.selectWallet)
export const getSharedKey = compose(Wallet.selectSharedKey, Wrapper.selectWallet)
export const getGuid = compose(Wallet.selectGuid, Wrapper.selectWallet)
export const getAddresses = compose(ImtoJS, map(Address.toJS), Wallet.selectAddresses, Wrapper.selectWallet)
export const getHDAccounts = compose(ImtoJS, map(HDAccount.toJS), Wallet.selectHDAccounts, Wrapper.selectWallet)
export const getSeedHex = compose(HDWallet.selectSeedHex, HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet)
export const getMnemonic = compose(e => e.getOrElse(''), entropyToMnemonic, getSeedHex)
export const getDefaultAccountIndex = compose(HDWallet.selectDefaultAccountIdx, HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet)
export const getAccountXpub = curry((index, state) => compose(HDAccount.selectXpub, HDWallet.selectAccount(index), HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet)(state))
export const getDefaultAccountXpub = state => getAccountXpub(getDefaultAccountIndex(state), state)
export const getInitialSocketContext = state => ({ guid: getGuid(state), addresses: getAddressContext(state), xpubs: getWalletContext(state) })
export const getLogoutTime = compose(Options.selectLogoutTime, Wallet.selectOptions, Wrapper.selectWallet)
export const isSecondPasswordOn = compose(Wallet.isDoubleEncrypted, Wrapper.selectWallet)
export const isMnemonicVerified = compose(HDWallet.selectMnemonicVerified, HDWalletList.selectHDWallet, Wallet.selectHdWallets, Wrapper.selectWallet)
