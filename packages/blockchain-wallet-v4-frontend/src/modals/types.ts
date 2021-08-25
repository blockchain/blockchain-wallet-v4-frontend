export type ModalPropsType = {
  close: () => void
  closeAll?: () => void
  position: number
  total: number
  userClickedOutside?: boolean
}
