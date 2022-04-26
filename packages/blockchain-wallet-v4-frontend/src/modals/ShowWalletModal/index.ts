import { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import { ShowWalletModal} from './ShowWalletModal'

export type { ShowWalletModalComponent, ShowWalletModalProps } from './ShowWalletModal.types'

export default modalEnhancer('SHOW_WALLET', { transition: duration })(ShowWalletModal)
