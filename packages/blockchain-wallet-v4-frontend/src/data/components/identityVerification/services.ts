import { both, compose, filter, flip, gte, lte, prop, values } from 'ramda'

import { model } from 'data'
import { KycStateType, Tiers } from 'data/modules/types'

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

  // TODO: refactor due to note and logic below

  // since kyc tier requirements are no longer in proper order due to SDD
  // need to check if selected is 3 (SDD) and reassign to 2 (Gold) in order
  // to ensure the correct next steps are generated for the user
  let selectedTier = selected === 3 ? 2 : selected
  // in similar vein, if selected is 1 and next is 2, need to force selected to be 2
  selectedTier = next === 2 && selected === 1 ? 2 : selectedTier

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

    return compose(both(lte(next), gte(selectedTier)), getStepTier)(step)
  }
  return filter(isStepRequired, values(STEPS))
}
