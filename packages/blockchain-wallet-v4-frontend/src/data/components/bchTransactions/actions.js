import * as AT from './actionTypes'

export const initialized = () => ({ type: AT.BCH_TRANSACTIONS_INITIALIZED })

export const reportClicked = () => ({
  type: AT.BCH_TRANSACTIONS_REPORT_CLICKED
})

export const loadMore = () => ({
  type: AT.BCH_TRANSACTIONS_LOAD_MORE
})
