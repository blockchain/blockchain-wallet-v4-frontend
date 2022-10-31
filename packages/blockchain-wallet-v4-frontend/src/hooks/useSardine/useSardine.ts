import { useEffect, useState } from 'react'

import { useDefer3rdPartyScript } from 'hooks'

export const useSardine = () => {
  const [sardineContext, setSardineContext] = useState(null)
  const [sardineDeviceInfo, setSardineDeviceInfo] = useState(null)

  const resolveSardineHost = (environment: string): string => {
    switch (environment) {
      case 'production':
        return 'api.sardine.ai'
      case 'sandbox':
        return 'api.sandbox.sardine.ai'
      default:
        return 'api.sandbox.sardine.ai'
    }
  }

  const xSessionId = localStorage.getItem('xSessionId')
  const sardineHost = resolveSardineHost(window?.SARDINE_ENVIRONMENT ?? 'sandbox')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReady, _] = useDefer3rdPartyScript(`https://${sardineHost}/assets/loader.min.js`, {
    attributes: {
      nonce: window.nonce
    }
  })

  useEffect(() => {
    if (isReady && !sardineContext) {
      const context = window?._Sardine?.createContext({
        clientId: window?.SARDINE_CLIENT_ID,
        environment: window?.SARDINE_ENVIRONMENT,
        flow: window.location.pathname,
        onDeviceResponse(data: any) {
          setSardineDeviceInfo(data)
        },
        parentElement: document.body,
        sessionKey: xSessionId
      })
      window._SardineContext = context
      setSardineContext(context)
    }
  }, [isReady, sardineContext, xSessionId])

  return [sardineContext, sardineDeviceInfo]
}

export default useSardine
