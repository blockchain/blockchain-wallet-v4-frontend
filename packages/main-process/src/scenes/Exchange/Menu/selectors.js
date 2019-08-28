import { USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import { selectors } from 'data'

export const getData = state => ({
  showGetStarted:
    selectors.modules.profile.getUserActivationState(state).getOrElse(null) ===
    USER_ACTIVATION_STATES.NONE
})
