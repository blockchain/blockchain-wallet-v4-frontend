export type SwitchLabelState = 'regular' | 'hover' | 'active'

export type SwitchWrapperProps = { background?: string; isFullWidth?: boolean }

export type SwitchLabelProps = {
  disabled?: boolean
  isFullWidth?: boolean
  selected: boolean
}

export type SwitchProps = {
  disabled?: boolean
  firstItem: string
  handleFirstItemClicked: () => void
  handleSecondItemClicked: () => void
  isFirstItemActive: boolean
  isFullWidth?: boolean
  secondItem: string
}
