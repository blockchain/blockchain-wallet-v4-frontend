import { anyPass, equals, lift } from 'ramda'

import { model, selectors } from 'data'
const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS
const { getEmail } = selectors.core.settings
const {
  getKycFlowConfig,
  getPreIdvData: getSiftData,
  getSupportedDocuments
} = selectors.components.identityVerification

export const getData = state => {
  const getEmailR = getEmail(state)
  const getSupportedDocumentsR = getSupportedDocuments(state)
  const getKycFlowConfigR = getKycFlowConfig(state)

  return lift((email, docTypes, flowConfig) => {
    const needsDocResubmit = selectors.modules.profile
      .getKycDocResubmissionStatus(state)
      .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
      .getOrElse(false)

    return {
      deeplink: 'https://blockchainwallet.page.link/dashboard',
      docTypes,
      email,
      flowConfig,
      needsDocResubmit
    }
  })(getEmailR, getSupportedDocumentsR, getKycFlowConfigR)
}

export const getPreIdvData = state => {
  const getPreIdvDataR = getSiftData(state)
  const getSiftKeyR = selectors.core.walletOptions.getSiftKey(state)

  const siftKey = getSiftKeyR.getOrElse('')

  return lift(preIdvData => {
    return {
      ...preIdvData,
      siftKey
    }
  })(getPreIdvDataR)
}
