import { equals } from 'ramda'

import { selectors, model } from 'data'

const { NONE } = model.profile.KYC_STATES

export const getData = state => ({
  kycNotFinished: selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(NONE))
    .getOrElse(false)
})
