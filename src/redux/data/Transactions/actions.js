
export const CONTEXT_TXS_LOAD = '@v3.CONTEXT_TXS_LOAD'
export const TXS_LOAD_REQUEST = '@v3.TXS_LOAD_REQUEST'
export const CONTEXT_TXS_CLEAR = '@v3.CONTEXT_TXS_CLEAR'

export const loadContextTxs = (data) =>
  ({ type: CONTEXT_TXS_LOAD, payload: data })
export const requestTxs = (context) =>
  ({ type: TXS_LOAD_REQUEST, payload: context })
export const clearTxs = (context) =>
  ({ type: CONTEXT_TXS_CLEAR, payload: context })
