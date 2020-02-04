import * as Address from './Address'
import * as AddressBook from './AddressBook'
import * as AddressBookEntry from './AddressBookEntry'
import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as AddressMap from './AddressMap'
import * as Cache from './Cache'
import * as HDAccount from './HDAccount'
import * as HDAccountList from './HDAccountList'
import * as HDWallet from './HDWallet'
import * as HDWalletList from './HDWalletList'
import * as KVStoreEntry from './KVStoreEntry'
import * as Options from './Options'
import * as TXNames from './TXNames'
import * as TXNotes from './TXNotes'
import * as Wallet from './Wallet'
import * as Wrapper from './Wrapper'
import serializer from './Serializer'

export {
  Wallet,
  Address,
  AddressLabel,
  HDWallet,
  HDAccount,
  Wrapper,
  Cache,
  serializer,
  AddressMap,
  AddressLabelMap,
  HDWalletList,
  HDAccountList,
  AddressBookEntry,
  AddressBook,
  TXNotes,
  TXNames,
  Options,
  KVStoreEntry
}

export type CoinType = 'BCH' | 'BTC' | 'ETH' | 'PAX' | 'XLM'

export type BtcAccountType = {
  balance: number
  coin: 'BTC'
  index: number
  label: string
  network: 'mainnet' | 'testnet'
  type: 'ACCOUNT'
  xpub: string
}

export type AccountTypes = BtcAccountType

export * from '../redux/walletOptions/types'
export * from '../network/api/borrow/types'
export * from '../network/types'
export * from '../remote/types'
export * from '../types/index'
