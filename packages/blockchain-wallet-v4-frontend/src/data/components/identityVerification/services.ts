import { both, compose, filter, flip, gte, lte, prop, values } from 'ramda'

import { model } from 'data'
import { STEP_TIERS, STEPS } from './model'

export const computeSteps = ({
  currentStep,
  mobileVerified,
  needMoreInfo,
  smsVerified,
  tiers
}) => {
  const { TIERS } = model.profile
  const { next, selected } = tiers
  const getStepTier = flip(prop)(STEP_TIERS)
  const skipMobile =
    currentStep !== STEPS.mobile && (smsVerified || mobileVerified)

  const isStepRequired = step => {
    if ((!needMoreInfo || next < TIERS[2]) && step === STEPS.moreInfo)
      return false
    if (skipMobile && step === STEPS.mobile) return false

    return compose(
      both(lte(next), gte(selected)),
      getStepTier
    )(step)
  }
  return filter(isStepRequired, values(STEPS))
}
