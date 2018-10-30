import { selectors } from 'data'
import { USER_ACTIVATION_STATES } from 'data/modules/profile/model'

export const getData = state => ({
  useShapeShift: selectors.components.exchange.useShapeShift(state),
  showGetStarted: selectors.modules.profile.getUserActivationState(state) === USER_ACTIVATION_STATES.NONE
})
