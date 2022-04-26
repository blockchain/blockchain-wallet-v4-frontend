export type FlyoutOpenStateHookResult = {
    onPressClose: () => void
    isOpen: boolean
}

export type FlyoutOpenStateHookProps = {
    duration?: number
    initialValue?: boolean
    onClose?: () => void
}

export type FlyoutOpenStateHook = (props?: FlyoutOpenStateHookProps) => FlyoutOpenStateHookResult