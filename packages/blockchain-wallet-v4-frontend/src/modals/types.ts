import { ModalNameType } from 'data/types'

export type ModalPropsType = {
  close: (name?: ModalNameType) => void
  closeAll?: () => void
  position: number
  total: number
  userClickedOutside?: boolean
}
