export type SupportChatStateHook = (initialValue?: boolean) => [
  {
    isOpen: boolean
    isReady: boolean
    setOpen: (value: boolean) => void
    setReady: (value: boolean) => void
  }
]
