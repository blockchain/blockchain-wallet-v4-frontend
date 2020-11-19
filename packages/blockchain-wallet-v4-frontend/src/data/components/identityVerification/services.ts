import { both, compose, filter, flip, gte, lte, prop, values } from 'ramda'

import { KycStateType, Tiers } from 'data/modules/types'
import { model } from 'data'
import { STEP_TIERS, STEPS } from './model'

export const computeSteps = ({
  kycState,
  needMoreInfo,
  tiers
}: {
  kycState: KycStateType
  needMoreInfo: boolean
  tiers: Tiers
}) => {
  const { TIERS } = model.profile
  const { next, selected } = tiers
  const getStepTier = flip(prop)(STEP_TIERS)

  const isStepRequired = step => {
    if ((!needMoreInfo || next < TIERS[2]) && step === STEPS.moreInfo) {
      return false
    }
    if (
      (kycState === 'PENDING' || kycState === 'VERIFIED') &&
      step === STEPS.verify
    ) {
      return false
    }

    return compose(both(lte(next), gte(selected)), getStepTier)(step)
  }
  return filter(isStepRequired, values(STEPS))
}
