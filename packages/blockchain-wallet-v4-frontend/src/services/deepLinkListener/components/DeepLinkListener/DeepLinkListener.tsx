import React, { useCallback } from 'react'

import { DeepLinkClickState, deepLinkListenerContext } from 'services/deepLinkListener/contexts'
import { useDeepLink } from 'services/deepLinkListener/hooks/useDeepLink/useDeepLink'

import { DeepLinkHandler, DeepLinkListenerComponent } from './DeepLinkListener.types'

const DeepLinkListener: DeepLinkListenerComponent = ({
  children,
  onClickDeepLink: onClickDeepLinkHandler
}) => {
  const { Provider } = deepLinkListenerContext
  const { onClickDeepLink } = useDeepLink()

  const handleOnClickDeepLink: DeepLinkHandler = useCallback(
    (link) => {
      const handled = onClickDeepLinkHandler(link)

      if (handled === DeepLinkClickState.notHandled) {
        return onClickDeepLink(link)
      }

      return handled
    },
    [onClickDeepLink, onClickDeepLinkHandler]
  )

  return <Provider value={{ onClickDeepLink: handleOnClickDeepLink }}>{children}</Provider>
}

export { DeepLinkListener }
