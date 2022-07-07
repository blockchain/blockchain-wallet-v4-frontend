import { useCallback, useEffect, useState } from 'react'

import { SupportChatOpenStateHook } from './useSupportChatOpenState.types'

export const useSupportChatOpenState: SupportChatOpenStateHook = (initialValue = false) => {
  const [isOpen, setOpen] = useState<boolean>(initialValue)

  const onMessage = useCallback(
    (event) => {
      const message = event.data
      // HMR/zendesk combo sends empty messages sometimes that result in widget state
      // being set to close when it really is still open
      if (message && typeof message.widgetOpen === 'boolean') {
        setOpen(message.widgetOpen)
      }
    },
    [setOpen]
  )

  useEffect(() => {
    window.addEventListener('message', onMessage, false)

    return () => {
      window.removeEventListener('message', onMessage, false)
    }
  }, [onMessage])

  return [isOpen, setOpen]
}
