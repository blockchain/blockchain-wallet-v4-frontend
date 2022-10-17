import { useEffect, useState } from 'react'

// type
type SardineEnvironment = 'sandbox' | 'production'

export const useDeviceIntelligence = () => {
  const [sardineContext, setSardineContext] = useState(null)
  const [sardineDeviceInfo, setSardineDeviceInfo] = useState(null)

  const resolveSardineHost = (_environment: SardineEnvironment): string => {
    switch (_environment) {
      case 'production':
        return 'api.sardine.ai'
      case 'sandbox':
        return 'api.sandbox.sardine.ai'
      default:
        return 'api.sandbox.sardine.ai'
    }
  }

  const sessionKey = 'REPLACE_SESSION_KEY_HERE'
  const userIdHash = 'REPLACE_USER_ID_HERE'
  const environment: SardineEnvironment = 'sandbox'

  useEffect(() => {
    if (!sessionKey) {
      return () => {}
    }
    const sardineHost = resolveSardineHost(environment)
    const script = document.createElement('script')
    script.src = `https://${sardineHost}/assets/loader.min.js`
    script.async = true
    script.type = 'text/javascript'

    script.onload = function () {
      //   console.log('Sardine: initializing non-production DI SDK.')
      /*
       * Creating context as per the docs and will expose it in future
       * https://docs.sardine.ai/web
       */
      const context = window?._Sardine?.createContext({
        clientId: process.env.REACT_APP_SARDINE_CLIENT_ID,
        environment,
        flow: window.location.pathname,
        onDeviceResponse(data: any) {
          //   console.log('Got DI SDK data:', data)
          setSardineDeviceInfo(data)
        },
        parentElement: document.body,
        sessionKey,
        userIdHash
      })
      setSardineContext(context)
    }

    const s = document.getElementsByTagName('script')[0]
    s?.parentNode?.insertBefore(script, s)
    return () => {
      //   console.log('Sardine: Cleaning up non-production DI SDK')
      script.remove()
    }
  }, [sessionKey])

  return [sardineContext, sardineDeviceInfo]
}

export default useDeviceIntelligence
