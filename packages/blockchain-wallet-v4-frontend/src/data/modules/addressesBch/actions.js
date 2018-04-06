import * as AT from './actionTypes'

export const editBchHdLabel = (accountIdx, addressIdx) => ({ type: AT.EDIT_BCH_HD_LABEL, payload: { accountIdx, addressIdx } })

export const editBchAccountLabel = (index, label) => ({ type: AT.EDIT_BCH_ACCOUNT_LABEL, payload: { index, label } })
