import { createContext } from 'react'

import { createUnhandledError } from 'services/deepLinkListener/utils'

import { DeepLinkListenerContext } from './DeelLinkListenerContext.types'

const defaultDeepLinkListenerContext: DeepLinkListenerContext = {
  onClickDeepLink: (link) => {
    console.error(createUnhandledError(link))

    return {
      handled: false
    }
  }
}
export const deepLinkListenerContext = createContext(defaultDeepLinkListenerContext)
