import * as AT from './actionTypes'

export const confirmTransferEth = payload => ({
  type: AT.CONFIRM_TRANSFER_ETH,
  payload
})

export const initialized = ({
  from,
  type
}: {
  from: string
  type: 'LEGACY'
}) => ({
  type: AT.TRANSFER_ETH_INITIALIZED,
  payload: {
    from,
    type
  }
})

export const transferEthPaymentUpdatedLoading = () => ({
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_LOADING
})
export const transferEthPaymentUpdatedSuccess = payment => ({
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_SUCCESS,
  payload: payment
})
export const transferEthPaymentUpdatedFailure = e => ({
  type: AT.TRANSFER_ETH_PAYMENT_UPDATED_FAILURE,
  payload: e
})
