export type AuthorizePubkeyParamType = {
  guid: string
  sharedKeyHash: string
}

export type AuthDataType = {
  guidHash: string
  sharedKeyHash: string
}

export enum BuildTxFeeType {
  HIGH = 'HIGH',
  LOW = 'LOW',
  NORMAL = 'NORMAL'
}

export enum BuildTxType {
  PAYMENT = 'PAYMENT',
  SWAP = 'SWAP',
  TOKEN_ALLOWANCE = 'TOKEN_ALLOWANCE'
}

export enum SourceStyleType {
  EXTENDED = 'EXTENDED',
  SINGLE = 'SINGLE'
}

export enum TxHistoryStatusType {
  COMPLETED = 'COMPLETED',
  CONFIRMING = 'CONFIRMING',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export enum TxHistoryActivityType {
  APPROVAL = 'APPROVAL',
  MINT = 'MINT',
  OTHER = 'OTHER',
  SMART_CONTRACT_CALL = 'SMART_CONTRACT_CALL',
  STAKE = 'STAKE',
  SWAP = 'SWAP',
  TRANSFER = 'TRANSFER'
}

export enum TxHistoryMovementType {
  RECEIVED = 'RECEIVED',
  SENT = 'SENT'
}

export type PubKeyType = {
  descriptor: number
  pubKey: string
  style: SourceStyleType
}

export type BuildTxSourceType = {
  descriptor: 'legacy'
  pubKey: string
  style: SourceStyleType
}

export type SwapTxType = {
  data: string
  gasLimit: string
  value: string
}

export type BuildTxExtraDataType = {
  feeCurrency?: string
  memo?: string
}

type BuildTxSwapExtraDataType = {
  swapTx: SwapTxType
}

type BuildTxTokenAllowanceExtraDataType = {
  spender: 'ZEROX_EXCHANGE'
}

type BuildTxCommonIntentType = {
  amount: string | 'MAX'
  currency: string
  destination: string
  fee: BuildTxFeeType | string
  maxVerificationVersion?: 2
  sources: BuildTxSourceType[]
}

export type BuildTxPaymentIntentType = {
  extraData?: BuildTxExtraDataType
  type: BuildTxType.PAYMENT
} & BuildTxCommonIntentType

export type BuildTxSwapIntentType = {
  extraData?: BuildTxSwapExtraDataType
  type: BuildTxType.SWAP
} & BuildTxCommonIntentType

export type BuildTxTokenAllowanceIntentType = {
  extraData?: BuildTxTokenAllowanceExtraDataType
  type: BuildTxType.TOKEN_ALLOWANCE
} & BuildTxCommonIntentType

export type BuildTxIntentParamType = {
  intent: BuildTxPaymentIntentType | BuildTxSwapIntentType | BuildTxTokenAllowanceIntentType
}

export type RawTxType = {
  created: number
  ttl: number
  version: number
}

export type SummaryType = {
  absoluteFeeEstimate: string
  absoluteFeeMaximum: string
  amount: string
  balance: string
  feeCurrency: string
  relativeFee: string
}

export type PreImageType = {
  descriptor: string
  preImage: string
  signatureAlgorithm: 'secp256k1'
  signingKeys: string
}

export type BuildTxResponseType = {
  preImages: PreImageType[]
  rawTx: RawTxType
  summary: SummaryType
}

export type SignatureType = {
  preImage: string
  signature: string
  signatureAlgorithm: 'secp256k1'
  signingKeys: string
}

export type PushTxParamType = {
  currency: string
  rawTx: RawTxType
  signatures: SignatureType[]
}

export type PushTxResponseType = {
  txId: string
}

export type GetAddressesCurrencyType = {
  memo?: string
  ticker: string
}

export type GetAddressesRequestType = {
  auth: AuthDataType
  currencies: GetAddressesCurrencyType[]
}

export type AddressType = {
  address: string
  default: boolean
  format: string
  includesMemo: boolean
  pubkey: string
}

export type AddressAccountType = {
  index: number
  name: string
}

export type GetAddressResultType = {
  account: AddressAccountType
  addresses: AddressType[]
}

export type GetAddressesResponseType = {
  results: GetAddressResultType[]
}

type CurrencyType = {
  ticker: string
}

export type GetUnifiedBalanceRequestType = {
  auth: AuthDataType
  currencies: CurrencyType[]
  fiatCurrency: string
}

export type BalanceType = {
  amount: number
  identifier: string
  unconfirmed: number
}

export type BalancesType = {
  balances: BalanceType[]
}

export type GetUnifiedBalanceResponseType = {
  results: BalancesType[]
}

export type GetSubscriptionsRequestType = {
  auth: AuthDataType
}

export type SubscriptionsAccountType = {
  index: number
  name: string
}

export type SubscriptionsType = {
  account: SubscriptionsAccountType
  currency: string
  pubKeys: PubKeyType[]
}

export type GetSubscriptionsResponseType = {
  subscriptions: SubscriptionsType[]
}

type PaginationType = {
  pageNumber: number
  pageSize: number
}

export type TxHistoryAddressType = {
  descriptor: string
  path?: string
  pubkey: string
}

export type TxHistoryAddressesType = {
  [address: string]: TxHistoryAddressType
}

export type TxHistoryExtraDataType = {
  blockHeight: number
  contractCall: string
  contractCallData: string
  memo: string
  sourceL2: string
  version: number
}

export type TxHistoryMovementsType = {
  address: string
  amount: number
  identifier: string
  type: TxHistoryMovementType
}

export type TxHistoriesType = {
  activityType: TxHistoryActivityType
  extraData: TxHistoryExtraDataType
  fee: number
  movements: TxHistoryMovementsType[]
  status: TxHistoryStatusType
  timestamp: number
  txid: string
}

export type GetTxHistoryRequestType = {
  auth: AuthDataType
  currency: string
  identifier: string
  pagination: PaginationType
}

export type GetTxHistoryResponseType = {
  addresses: TxHistoryAddressesType
  history: TxHistoriesType[]
  pagination: PaginationType
}

export type DeriveAddressParamType = {
  coin: string
  pubkey: string
}

export type DeriveAddressResponseType = {
  results: {
    address: string
    default: boolean
    format: string
    pubKey: string
  }[]
}

export type SubscribeAccountType = {
  account: {
    index: number
    name: string
  }
  currency: string
  pubKeys: PubKeyType[]
}

export type SubscribeRequestType = {
  auth: AuthDataType
  data: SubscribeAccountType[]
}

export type UnsubscribeRequestType = {
  auth: AuthDataType
  currency: string
}

export type ValidateAddressParamType = {
  address: string
  coin: string
}

export type GenericPubKeyResponse = {
  error?: string
  message?: string
  success: boolean
}
