import { BeneficiariesType, RemoteDataType, SwapOrderType } from '@core/types'

export type ProductEligibilityForUser = {
  buy: {
    canPlaceOrder: boolean
    enabled: boolean
    id: 'BUY'
    maxOrdersLeft: number
  }
  custodialWallets: {
    canDepositCrypto: boolean
    canDepositFiat: boolean
    canWithdrawCrypto: boolean
    canWithdrawFiat: boolean
    enabled: boolean
    id: 'CUSTODIAL_WALLET'
  }
  exchange: {
    canDepositCrypto: boolean
    canDepositFiat: boolean
    canTrade: boolean
    canWithdrawCrypto: boolean
    canWithdrawFiat: boolean
    enabled: boolean
    id: 'EXCHANGE'
  }
  swap: {
    canPlaceOrder: boolean
    enabled: boolean
    id: 'SWAP'
    maxOrdersLeft: number
  }
}

// State
export type CustodialState = {
  beneficiaries: RemoteDataType<string, BeneficiariesType>
  productEligibilityForUser: RemoteDataType<string, ProductEligibilityForUser>
  recentSwapTxs: RemoteDataType<string, SwapOrderType[]>
}
