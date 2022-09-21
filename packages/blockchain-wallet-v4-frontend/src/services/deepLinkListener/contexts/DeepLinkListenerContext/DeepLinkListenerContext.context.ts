import { createContext } from 'react'

import { createUnhandledError } from 'services/deepLinkListener/utils'

import { DeepLinkClickState, DeepLinkListenerContext } from './DeepLinkListenerContext.types'

const defaultDeepLinkListenerContext: DeepLinkListenerContext = {
  onClickDeepLink: (link) => {
    console.error(createUnhandledError(link))

    return DeepLinkClickState.notHandled
  }
}
export const deepLinkListenerContext = createContext(defaultDeepLinkListenerContext)
