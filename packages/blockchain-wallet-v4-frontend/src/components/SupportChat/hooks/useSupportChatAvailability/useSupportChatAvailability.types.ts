type SupportChatAvailabilityHookProps = {
  iframeId: string
}

export type SupportChatAvailabilityHook = (props: SupportChatAvailabilityHookProps) => {
  isAvailable: boolean
}
