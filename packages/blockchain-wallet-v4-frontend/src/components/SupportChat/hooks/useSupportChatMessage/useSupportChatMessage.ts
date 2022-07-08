import { useCallback } from 'react'

import { waitForIframeContentToLoad } from 'components/SupportChat/utils'

import { SendMessageCallback, SupportChatMessageHook } from './useSupportChatMessage.types'

export const useSupportChatMessage: SupportChatMessageHook = ({ iframeId }) => {
  const sendMessage: SendMessageCallback = useCallback(
    async (methodName, data) => {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null

      if (!iframe || !iframe.contentWindow || !(await waitForIframeContentToLoad({ iframeId })))
        return false

      iframe.contentWindow.postMessage({ messageData: data, method: methodName }, '*')

      return true
    },
    [iframeId]
  )

  return {
    sendMessage
  }
}
