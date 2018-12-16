import { both, compose, filter, flip, gte, lt, path, prop, values } from 'ramda'
import { model, selectors } from 'data'
import { STEPS, STEP_TIERS } from './model'

export const getVerificationStep = path([
  'components',
  'identityVerification',
  'verificationStep'
])
export const getSmsStep = path([
  'components',
  'identityVerification',
  'smsStep'
])
export const getEmailStep = path([
  'components',
  'identityVerification',
  'emailStep'
])

export const getSupportedCountries = path([
  'components',
  'identityVerification',
  'supportedCountries'
])

export const getSupportedDocuments = path([
  'components',
  'identityVerification',
  'supportedDocuments'
])

export const getStates = path(['components', 'identityVerification', 'states'])

export const getKycFLowType = path([
  'components',
  'identityVerification',
  'flowType'
])

export const isCoinifyKyc = path([
  'components',
  'identityVerification',
  'isCoinify'
])

export const getDesiredTier = path([
  'components',
  'identityVerification',
  'desiredTier'
])

export const getSteps = state => {
  const { TIERS } = model.profile
  const getStepTier = flip(prop)(STEP_TIERS)
  const isCoinify = isCoinifyKyc(state)
  const desiredTier = getDesiredTier(state)
  const userTier = selectors.modules.profile
    .getUserTier(state)
    .getOrElse(TIERS[0])
  const mobileVerified = selectors.modules.profile
    .getUserData(state)
    .map(prop('mobileVerified'))
    .getOrElse(false)
  const smsVerified = selectors.core.settings.getSmsVerified(state).getOrElse(0)
  const currentStep = getVerificationStep(state)
  const skipMobile =
    currentStep !== STEPS.mobile && (smsVerified || mobileVerified)

  const isStepRequired = step => {
    if (!isCoinify && step === STEPS.coinify) return false
    if (skipMobile && step === STEPS.mobile) return false

    return compose(
      both(lt(userTier), gte(desiredTier)),
      getStepTier
    )(step)
  }
  return filter(isStepRequired, values(STEPS))
}
