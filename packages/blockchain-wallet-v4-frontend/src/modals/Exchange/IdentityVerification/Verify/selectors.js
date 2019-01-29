import { equals, lift } from 'ramda'

import { selectors } from 'data'

const {
  getSupportedDocuments,
  getKycFlowConfig
} = selectors.components.identityVerification

const { getEmail } = selectors.core.settings

export const getData = state => {
  return lift((email, docTypes, flowConfig) => {
    const needsDocResubmit = selectors.modules.profile
      .getKycDocResubmissionStatus(state)
      .map(equals(0)) // TODO: update and use a model
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
