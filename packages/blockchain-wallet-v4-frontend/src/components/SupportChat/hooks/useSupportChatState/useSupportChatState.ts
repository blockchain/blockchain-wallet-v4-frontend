import { useCallback, useEffect, useState } from 'react'

import { SupportChatStateHook } from './useSupportChatState.types'

export const useSupportChatState: SupportChatStateHook = (initialValue = false) => {
  const [isOpen, setOpen] = useState<boolean>(initialValue)
  const [isReady, setReady] = useState<boolean>(initialValue)

  const onMessage = useCallback(
    (event) => {
      const message = event.data

      if (message && typeof message.widgetOpen === 'boolean') {
        setOpen(message.widgetOpen)
      }

      if (message && typeof message.widgetReady === 'boolean') {
        setReady(message.widgetReady)
      }
    },
    [setOpen, setReady]
  )

  useEffect(() => {
    window.addEventListener('message', onMessage, false)

    return () => {
      window.removeEventListener('message', onMessage, false)
    }
  }, [onMessage])

  return [{ isOpen, isReady, setOpen, setReady }]
}
