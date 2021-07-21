import { BeneficiariesType, RemoteDataType, SwapOrderType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

// state
export type CustodialState = {
  beneficiaries: RemoteDataType<string, BeneficiariesType>
  recentSwapTxs: RemoteDataType<string, SwapOrderType[]>
}

// actions
interface FetchBeneficiariesFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_CUSTODIAL_BENEFICIARIES_FAILURE
}
interface FetchBeneficiariesLoading {
  type: typeof AT.FETCH_CUSTODIAL_BENEFICIARIES_LOADING
}
interface FetchBeneficiariesSuccess {
  payload: {
    beneficiaries: BeneficiariesType
  }
  type: typeof AT.FETCH_CUSTODIAL_BENEFICIARIES_SUCCESS
}

interface FetchRecentSwapTxsFailure {
  type: typeof AT.FETCH_RECENT_SWAP_TXS_FAILURE
}

interface FetchRecentSwapTxsLoading {
  type: typeof AT.FETCH_RECENT_SWAP_TXS_LOADING
}

interface FetchRecentSwapTxsSuccess {
  payload: {
    data: SwapOrderType[]
  }
  type: typeof AT.FETCH_RECENT_SWAP_TXS_SUCCESS
}

export type CustodialActionTypes =
  | FetchBeneficiariesFailure
  | FetchBeneficiariesSuccess
  | FetchBeneficiariesLoading
  | FetchRecentSwapTxsFailure
  | FetchRecentSwapTxsSuccess
  | FetchRecentSwapTxsLoading
