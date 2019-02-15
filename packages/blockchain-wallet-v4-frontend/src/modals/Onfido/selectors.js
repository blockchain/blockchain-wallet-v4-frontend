import { path } from 'ramda'
import { selectors } from 'data'
const { getOnfidoSDKKey, getOnfidoSyncStatus } = selectors.components.onfido
const { getSupportedDocuments } = selectors.components.identityVerification
export const getData = state => ({
  onfidoSDKKey: getOnfidoSDKKey(state),
  onfidoSyncStatus: getOnfidoSyncStatus(state),
  supportedDocuments: getSupportedDocuments(state).getOrElse([
    'PASSPORT',
    'DRIVERS_LICENSE'
  ]),
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  )
})
