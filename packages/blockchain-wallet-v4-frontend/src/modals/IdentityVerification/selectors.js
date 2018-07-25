import { compose, path } from 'ramda'
import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { ADDRESS_FORM, STEPS } from 'data/components/identityVerification/model'
import { ACTIVATION_STATES, KYC_STATES } from 'data/modules/profile/model'

const deriveStep = ({ activationState, kycState }) => {
  if (activationState === ACTIVATION_STATES.NONE) return STEPS.personal
  if (activationState === ACTIVATION_STATES.CREATED) return STEPS.address
  if (
    activationState === ACTIVATION_STATES.ACTIVE &&
    kycState === KYC_STATES.NONE
  )
    return STEPS.verify
  return null
}
export const getData = state => ({
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  ),
  step: compose(
    deriveStep,
    state => ({
      activationState: selectors.modules.profile.getUserActivationState(state),
      kycState: selectors.modules.profile.getUserKYCState(state)
    })
  )(state)
})

const addressFormSelector = formValueSelector(ADDRESS_FORM)
export const getAddressData = state => ({
  initialValues: {
    countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
  },
  countryCode: addressFormSelector(state, 'countryCode')
})
