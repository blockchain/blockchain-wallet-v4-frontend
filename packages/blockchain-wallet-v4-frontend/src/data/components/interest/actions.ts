import * as AT from './actionTypes'
import { CoinType } from 'core/types'
import { InterestActionTypes } from './types'
import {
  InterestEligibleType,
  InterestLimitsType
} from 'core/network/api/interest/types'

export const fetchInterestEligible = () => ({
  type: AT.FETCH_INTEREST_ELIGIBLE
})
export const fetchInterestEligibleFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestEligibleLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_LOADING
})
export const fetchInterestEligibleSuccess = (
  interestEligible: InterestEligibleType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_SUCCESS,
  payload: {
    interestEligible
  }
})

export const fetchInterestLimits = () => ({
  type: AT.FETCH_INTEREST_LIMITS
})
export const fetchInterestLimitsFailure = (
  error: string
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_FAILURE,
  payload: {
    error
  }
})
export const fetchInterestLimitsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_LOADING
})
export const fetchInterestLimitsSuccess = (
  interestLimits: InterestLimitsType
): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_SUCCESS,
  payload: {
    interestLimits
  }
})

export const initializeInterest = (coin: CoinType) => ({
  payload: {
    coin
  },
  type: AT.INITIALIZE_INTEREST
})
