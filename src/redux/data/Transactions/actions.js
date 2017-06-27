
export const CONTEXT_TXS_LOAD = '@v3.CONTEXT_TXS_LOAD'
export const TXS_LOAD_REQUEST = '@v3.TXS_LOAD_REQUEST'
export const CONTEXT_TXS_CLEAR = '@v3.CONTEXT_TXS_CLEAR'
export const SET_ONLY_SHOW = '@v3.SELECT_ONLY_SHOW'

export const loadContextTxs = (payload) =>
  ({ type: CONTEXT_TXS_LOAD, payload })
export const requestTxs = (payload) =>
  ({ type: TXS_LOAD_REQUEST, payload })
export const setOnlyShow = (payload) =>
  ({ type: SET_ONLY_SHOW, payload })
