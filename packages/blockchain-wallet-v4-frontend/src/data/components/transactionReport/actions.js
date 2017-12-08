import * as AT from './actionTypes'

export const initTransactionReport = (address, start, end) => ({ type: AT.INIT_TRANSACTION_REPORT, payload: { address, start, end } })
