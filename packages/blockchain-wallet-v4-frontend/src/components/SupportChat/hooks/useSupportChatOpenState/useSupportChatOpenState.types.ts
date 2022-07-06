export type SupportChatOpenStateHook = (
  initialValue?: boolean
) => [boolean, (value: boolean) => void]
