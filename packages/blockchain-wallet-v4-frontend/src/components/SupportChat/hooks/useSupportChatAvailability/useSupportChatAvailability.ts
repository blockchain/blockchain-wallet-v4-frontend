import { useEffect, useState } from 'react'

import { waitForIframeContentToLoad } from 'components/SupportChat/utils'

import { SupportChatAvailabilityHook } from './useSupportChatAvailability.types'

export const useSupportChatAvailability: SupportChatAvailabilityHook = ({ iframeId }) => {
  const [isAvailable, setAvailability] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      setAvailability(await waitForIframeContentToLoad({ iframeId }))
    }, 500)

    return () => clearInterval(interval)
  }, [iframeId])

  return {
    isAvailable
  }
}
