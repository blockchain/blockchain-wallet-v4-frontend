import { useEffect, useState } from 'react'
import sha256 from 'crypto-js/sha256'

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

  const xSessionId = sessionStorage.getItem('xSessionId')
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
        flow: 'IGNORE', // per default we are going to ignore al flows except those which we monitor
        onDeviceResponse(data: any) {
          setSardineDeviceInfo(data)
        },
        parentElement: document.body,
        sessionKey: sha256(xSessionId).toString()
      })
      window._SardineContext = context
      setSardineContext(context)
    }
  }, [isReady, sardineContext, xSessionId])

  return [sardineContext, sardineDeviceInfo]
}

export default useSardine
