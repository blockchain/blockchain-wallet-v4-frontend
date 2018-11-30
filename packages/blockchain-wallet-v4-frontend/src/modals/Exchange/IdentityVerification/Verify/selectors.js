import { lift } from 'ramda'

import { selectors } from 'data'

const {
  getSupportedDocuments,
  getKycFLowType
} = selectors.components.identityVerification

const { getEmail } = selectors.core.settings

export const getData = state => {
  return lift((email, docTypes, flowType) => ({
    email,
    deeplink: 'https://blockchainwallet.page.link/dashboard',
    docTypes,
    flowType
  }))(getEmail(state), getSupportedDocuments(state), getKycFLowType(state))
}
