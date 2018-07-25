import { path } from 'ramda'
import { selectors } from 'data'

const { getOnfidoSDKKey, getOnfidoSyncStatus } = selectors.components.onfido

export const getData = state => ({
  onfidoSDKKey: getOnfidoSDKKey(state),
  onfidoSyncStatus: getOnfidoSyncStatus(state),
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  )
})
