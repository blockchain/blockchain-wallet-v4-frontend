import React, { useCallback } from 'react'

import {
  DeepLinkListenerContext,
  deepLinkListenerContext
} from 'services/deepLinkListener/contexts'
import { useDeepLink } from 'services/deepLinkListener/hooks/useDeepLink/useDeepLink'

import { DeepLinkHandler, DeepLinkListenerComponent } from './DeepLinkListener.types'

const DeepLinkListener: DeepLinkListenerComponent = ({ children, handlers }) => {
  const { Provider } = deepLinkListenerContext
  const { onClickDeepLink } = useDeepLink()

  const handleOnClickDeepLink: DeepLinkListenerContext['onClickDeepLink'] = useCallback(
    (link) => {
      const handler: DeepLinkHandler | undefined = handlers[link]

      if (!handler) {
        return onClickDeepLink(link)
      }
      handler(link)

      return {
        handled: true
      }
    },
    [onClickDeepLink, handlers]
  )

  return <Provider value={{ onClickDeepLink: handleOnClickDeepLink }}>{children}</Provider>
}

export { DeepLinkListener }
