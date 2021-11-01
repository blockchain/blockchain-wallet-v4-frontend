import * as AT from './actionTypes'

export const confirmTransferEth = (payload) => ({
  payload,
  type: AT.CONFIRM_TRANSFER_ETH
})

export const initialized = ({ from, type }: { from: string; type: 'LEGACY' }) => ({
  payload: {
    from,
    type
  },
  type: AT.TRANSFER_ETH_INITIALIZED
})

export const transferEthPaymentUpdatedLoading = () => ({
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_LOADING
})
export const transferEthPaymentUpdatedSuccess = (payment) => ({
  payload: payment,
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_SUCCESS
})
export const transferEthPaymentUpdatedFailure = (e) => ({
  payload: e,
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_FAILURE
})
