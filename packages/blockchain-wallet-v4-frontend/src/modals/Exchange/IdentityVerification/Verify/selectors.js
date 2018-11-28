import { lift } from 'ramda'

import { selectors } from 'data'

const {
  getSupportedDocuments,
  getKycFLowType
} = selectors.components.identityVerification

const { getUserData } = selectors.modules.profile

export const getData = state => {
  return lift(({ mobile }, docTypes, flowType) => ({
    mobile,
    docTypes,
    flowType
  }))(getUserData(state), getSupportedDocuments(state), getKycFLowType(state))
}
