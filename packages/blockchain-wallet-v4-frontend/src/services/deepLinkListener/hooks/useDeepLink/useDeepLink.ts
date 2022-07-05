import { useContext } from 'react'

import { deepLinkListenerContext } from 'services/deepLinkListener/contexts'

import { DeepLinkHook } from './useDeepLink.types'

const useDeepLink: DeepLinkHook = () => useContext(deepLinkListenerContext)

export { useDeepLink }
