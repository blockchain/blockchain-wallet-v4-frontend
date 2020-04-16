import * as AT from './actionTypes'
import { AccountTypes, CoinType } from 'core/types'

export enum InterestSteps {
  'Deposit'
}

export interface InterestState {
  coin: CoinType
}

interface InitializeInterestAction {
  payload: {
    coin: CoinType
  }
  type: typeof AT.INITIALIZE_INTEREST
}

export type InterestFormValuesType = {
  agreement: boolean
  depositAmount: number
  interestDepositSelect: AccountTypes
  terms: boolean
}

export type InterestActionTypes = InitializeInterestAction
