import {
  BeneficiariesType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

// state
export type CustodialState = {
  beneficiaries: RemoteDataType<string, BeneficiariesType>
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

export type CustodialActionTypes =
  | FetchBeneficiariesFailure
  | FetchBeneficiariesSuccess
  | FetchBeneficiariesLoading
