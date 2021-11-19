import {
  CoinType,
  CrossBorderLimits,
  PaymentValue,
  RemoteDataType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from '@core/types'

export type MempoolFeeType = 'regular' | 'priority'

export enum SwapBaseCounterTypes {
  ACCOUNT = 'ACCOUNT',
  CUSTODIAL = 'CUSTODIAL'
}
export type SwapAccountType = {
  accountIndex?: number
  address?: number | string
  archived?: boolean
  balance: number | string
  baseCoin: string
  coin: CoinType
  index?: number
  label: string
  type: SwapBaseCounterTypes
}

export type SwapAmountFormValues = { amount?: string; cryptoAmount?: string } | undefined

export type InitSwapFormValuesType =
  | {
      BASE?: SwapAccountType
      COUNTER?: SwapAccountType
    }
  | undefined

export type SwapCoinType = CoinType

export enum SwapStepType {
  'INIT_SWAP',
  'COIN_SELECTION',
  'NO_HOLDINGS',
  'ENTER_AMOUNT',
  'UPGRADE_PROMPT',
  'PREVIEW_SWAP',
  'SUCCESSFUL_SWAP',
  'ORDER_DETAILS'
}

export type SwapSideType = 'BASE' | 'COUNTER'
export type SwapCheckoutFixType = 'CRYPTO' | 'FIAT'

// state
export type SwapState = {
  crossBorderLimits: RemoteDataType<string, CrossBorderLimits>
  custodialEligibility: RemoteDataType<string, boolean>
  fix: SwapCheckoutFixType
  limits: RemoteDataType<string, SwapUserLimitsType>
  order?: SwapOrderType
  pairs: RemoteDataType<string, Array<string>>
  payment: RemoteDataType<string, undefined | PaymentValue>
  quote: RemoteDataType<string, { quote: SwapQuoteType; rate: number }>
  side: SwapSideType
  step: keyof typeof SwapStepType
  trades: {
    list: Array<SwapOrderType>
    status: RemoteDataType<string, string>
  }
}

export type SwapStepPayload =
  // added these optional payloads for data science tracking
  | {
      options?: {
        account?: SwapBaseCounterTypes
        coin?: CoinType
        side?: 'BASE' | 'COUNTER'
      }
      step: 'ENTER_AMOUNT'
    }
  | {
      options?: {
        account?: SwapBaseCounterTypes
        coin?: CoinType
        side?: 'BASE' | 'COUNTER'
      }
      step: 'INIT_SWAP'
    }
  | {
      options?: {
        baseAccountType?: SwapBaseCounterTypes
        baseCoin?: CoinType
        counterAccountType?: SwapBaseCounterTypes
        counterCoin?: CoinType
      }
      step: 'PREVIEW_SWAP'
    }
  | {
      options: {
        order: SwapOrderType
      }
      step: 'ORDER_DETAILS'
    }
  | {
      options: {
        order: SwapOrderType
      }
      step: 'SUCCESSFUL_SWAP'
    }
  | { options: { side: 'BASE' | 'COUNTER' }; step: 'COIN_SELECTION' }
  | { options?: never; step: 'UPGRADE_PROMPT' }
  | {
      options?: never
      step: 'NO_HOLDINGS'
    }
