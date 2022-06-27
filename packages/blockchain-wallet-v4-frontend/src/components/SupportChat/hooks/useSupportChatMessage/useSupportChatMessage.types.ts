export type SendMessageCallback = (methodName: string, data?: unknown) => Promise<boolean>

export type SupportChatMessageHookProps = {
  iframeId: string
}

export type SupportChatMessageHook = (props: SupportChatMessageHookProps) => {
  sendMessage: SendMessageCallback
}
