import * as AT from './actionTypes'

export const setConnectStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
})

export const initializeConnect = () => ({ type: AT.INITIALIZE_CONNECT })
export const deviceInfoLoading = () => ({ type: AT.DEVICE_INFO_LOADING })
export const deviceInfoSuccess = () => ({ type: AT.DEVICE_INFO_SUCCESS })
export const deviceInfoFailure = () => ({ type: AT.DEVICE_INFO_FAILURE })

export const derviveCarbonXpubs = () => ({ type: AT.DERIVE_CARBON_XPUBS })
