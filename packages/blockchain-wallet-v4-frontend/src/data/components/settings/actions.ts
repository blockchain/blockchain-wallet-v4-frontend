import * as AT from './actionTypes'
import { NabuProductType } from './types'

export const notificationsInitialized = () => ({
  type: AT.SETTINGS_NOTIFICATIONS_INITIALIZED
})

// FETCH PRODUCT Eligibility
export const fetchProductsEligibility = () => ({
  type: AT.FETCH_PRODUCTS_ELIGIBILITY
})
export const fetchProductsEligibilityLoading = () => ({
  type: AT.FETCH_PRODUCTS_ELIGIBILITY_LOADING
})
export const fetchProductsEligibilitySuccess = (
  data: Array<NabuProductType>
) => ({
  type: AT.FETCH_PRODUCTS_ELIGIBILITY_SUCCESS,
  payload: data
})
export const fetchProductsEligibilityFailure = error => ({
  type: AT.FETCH_PRODUCTS_ELIGIBILITY_FAILURE,
  payload: error
})
