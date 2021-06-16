import { Erc20CurrenciesType, FiatCurrenciesType } from 'core/exchange/currencies'

import * as Address from './Address'
import * as AddressBook from './AddressBook'
import * as AddressBookEntry from './AddressBookEntry'
import * as AddressLabel from './AddressLabel'
import * as AddressLabelMap from './AddressLabelMap'
import * as AddressMap from './AddressMap'
import * as Cache from './Cache'
import * as Derivation from './Derivation'
import * as DerivationList from './DerivationList'
import * as HDAccount from './HDAccount'
import * as HDAccountList from './HDAccountList'
import * as HDWallet from './HDWallet'
import * as HDWalletList from './HDWalletList'
import * as KVStoreEntry from './KVStoreEntry'
import * as Options from './Options'
import serializer from './Serializer'
import * as TXNames from './TXNames'
import * as TXNotes from './TXNotes'
import * as Wallet from './Wallet'
import * as Wrapper from './Wrapper'

export {
  Address,
  AddressBook,
  AddressBookEntry,
  AddressLabel,
  AddressLabelMap,
  AddressMap,
  Cache,
  Derivation,
  DerivationList,
  HDAccount,
  HDAccountList,
  HDWallet,
  HDWalletList,
  KVStoreEntry,
  Options,
  serializer,
  TXNames,
  TXNotes,
  Wallet,
  Wrapper
}

export enum CoinTypeEnum {
  AAVE,
  ALGO,
  BCH,
  BTC,
  DOT,
  ETH,
  PAX,
  USDT,
  WDGLD,
  XLM,
  YFI
}
export enum FiatTypeEnum {
  EUR,
  USD,
  AUD,
  BRL,
  CAD,
  CHF,
  CLP,
  CNY,
  DKK,
  GBP,
  HKD,
  INR,
  ISK,
  JPY,
  KRW,
  NZD,
  PLN,
  RUB,
  SEK,
  SGD,
  THB,
  TWD
}
export enum WalletFiatEnum {
  EUR,
  GBP,
  USD
}

export const WalletCurrencyEnum = {
  ...CoinTypeEnum,
  ...WalletFiatEnum
}
export type CoinType = keyof typeof CoinTypeEnum

export type Erc20CoinType = keyof Erc20CurrenciesType

// All Fiats
export type FiatType = keyof FiatCurrenciesType

// Custodial Fiats
export type WalletFiatType = keyof typeof WalletFiatEnum

// Supported for transactions/balances
export type WalletCurrencyType = CoinType | WalletFiatType

export type BtcAccountType = {
  address?: string | number
  balance: number
  coin: 'BTC'
  index: number
  label: string
  network: 'mainnet'
  type: 'ACCOUNT' | 'CUSTODIAL'
  xpub: string
}

export type HDDerivationType = 'bech32' | 'legacy'

export type AccountTypes = BtcAccountType

export * from '../coinSelection/types'
export * from '../exchange/currencies'
export * from '../network/api/borrow/types'
export * from '../network/api/custodial/types'
export * from '../network/api/eth/types'
export * from '../network/api/interest/types'
export * from '../network/api/kyc/types'
export * from '../network/api/misc/types'
export * from '../network/api/simpleBuy/types'
export * from '../network/api/swap/types'
export * from '../network/types'
export * from '../redux/data/custodial/types'
export * from '../redux/data/misc/types'
export * from '../redux/payment/types'
export * from '../redux/settings'
export * from '../redux/walletOptions/types'
export * from '../remote/types'
export * from '../transactions/types'
export * from './index'
export * from './WalletPayload'
