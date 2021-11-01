import * as AT from './actionTypes'

export const editBchAccountLabel = (index, label) => ({
  payload: { index, label },
  type: AT.EDIT_BCH_ACCOUNT_LABEL
})

export const showChangeAddrs = (index, xpub) => ({
  payload: { index, xpub },
  type: AT.SHOW_BCH_CHANGE_ADDRS
})
