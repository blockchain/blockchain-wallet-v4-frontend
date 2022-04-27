import { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'

import { GenericErrorFlyout } from './GenericErrorFlyout'

export { GenericErrorFlyout } from './GenericErrorFlyout'
export type {
  GenericErrorFlyoutComponent,
  GenericErrorFlyoutProps
} from './GenericErrorFlyout.types'

export default modalEnhancer('GENERIC_ERROR_MODAL', { transition: duration })(GenericErrorFlyout)
