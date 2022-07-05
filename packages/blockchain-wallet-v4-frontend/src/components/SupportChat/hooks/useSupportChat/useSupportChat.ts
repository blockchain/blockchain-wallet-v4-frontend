import { useCallback } from 'react'

import { useSupportChatMessage } from '../useSupportChatMessage'
import { SupportChatHook } from './useSupportChat.types'

export const useSupportChat: SupportChatHook = () => {
  const { sendMessage } = useSupportChatMessage({
    iframeId: 'zendesk-iframe'
  })

  const open = useCallback(() => {
    sendMessage('activate')
  }, [sendMessage])

  return {
    open
  }
}
