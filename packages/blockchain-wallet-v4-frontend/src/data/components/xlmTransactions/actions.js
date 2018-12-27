import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.TRANSACTIONS_INITIALIZED })

export const reportClicked = () => ({
  type: AT.TRANSACTIONS_REPORT_CLICKED
})

export const loadMore = () => ({
  type: AT.XLM_TRANSACTIONS_LOAD_MORE
})
