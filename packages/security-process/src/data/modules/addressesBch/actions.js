import * as AT from './actionTypes'

export const editBchAccountLabel = (index, label) => ({
  type: AT.EDIT_BCH_ACCOUNT_LABEL,
  payload: { index, label }
})

export const showChangeAddrs = (index, xpub) => ({
  type: AT.SHOW_BCH_CHANGE_ADDRS,
  payload: { index, xpub }
})
