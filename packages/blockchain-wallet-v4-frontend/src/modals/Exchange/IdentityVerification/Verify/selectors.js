import { anyPass, equals, lift } from 'ramda'

import { model, selectors } from 'data'
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS
const { getEmail } = selectors.core.settings
const {
  getSupportedDocuments,
  getKycFlowConfig
} = selectors.components.identityVerification

export const getData = state => {
  return lift((email, docTypes, flowConfig) => {
    const needsDocResubmit = selectors.modules.profile
      .getKycDocResubmissionStatus(state)
      .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
      .getOrElse(false)

    return {
      email,
      deeplink: 'https://blockchainwallet.page.link/dashboard',
      docTypes,
      flowConfig,
      needsDocResubmit
    }
  })(getEmail(state), getSupportedDocuments(state), getKycFlowConfig(state))
}
