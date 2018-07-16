import { selectors } from 'data'

export const getData = (state) => ({
  isOnfidoEnabled: selectors.components.identityVerification.isOnfidoEnabled(state),
  step: selectors.components.identityVerification.getStep(state).getOrElse(null)
})
