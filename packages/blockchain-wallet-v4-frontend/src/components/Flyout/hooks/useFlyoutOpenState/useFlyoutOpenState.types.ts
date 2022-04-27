export type FlyoutOpenStateHookResult = {
  isOpen: boolean
  onPressClose: () => void
}

export type FlyoutOpenStateHookProps = {
  duration?: number
  initialValue?: boolean
  onClose?: () => void
}

export type FlyoutOpenStateHook = (props?: FlyoutOpenStateHookProps) => FlyoutOpenStateHookResult
