import { compose, map } from 'ramda'
import Either from 'data.either'
import BIP39 from 'bip39'
import { Wallet
       , Wrapper
       , HDAccount
       , Address
       , HDWalletList
       , HDWallet
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
