import { lift } from 'ramda'

import { selectors } from 'data'

const {
  getSupportedDocuments,
  getKycFlowConfig
} = selectors.components.identityVerification

const { getEmail } = selectors.core.settings

export const getData = state => {
  return lift((email, docTypes, flowConfig) => ({
    email,
    deeplink: 'https://blockchainwallet.page.link/dashboard',
    docTypes,
    flowConfig
  }))(getEmail(state), getSupportedDocuments(state), getKycFlowConfig(state))
}
