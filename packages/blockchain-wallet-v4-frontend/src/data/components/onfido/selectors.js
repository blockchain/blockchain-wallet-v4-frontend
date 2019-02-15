import { path } from 'ramda'
export const getApplicantId = path(['components', 'onfido', 'applicantId'])
export const getOnfidoSDKKey = path(['components', 'onfido', 'onfidoSDKKey'])
export const getOnfidoSyncStatus = path([
  'components',
  'onfido',
  'onfidoSyncStatus'
])
