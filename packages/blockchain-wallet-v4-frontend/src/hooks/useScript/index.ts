import { useEffect, useState } from 'react'
import useClientHydrated from '@charlietango/use-client-hydrated'

export enum ScriptStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

/**
 * Hook to load an external script. Returns true once the script has finished loading.
 *
 * @param url {string} url The external script to load
 * @param options {} options for hook
 * @param options.attributes {} attributes object for Script tag attributes
 * */
export default function useScript(url?: string, options?: {
  attributes?: {
    [k: string]: string
  }
}): [boolean, ScriptStatus] {
  const clientHydrated = useClientHydrated()
  const attributes = options?.attributes
  const [status, setStatus] = useState<ScriptStatus>(() => {
    if (clientHydrated) {
      const script: HTMLScriptElement | null = document.querySelector(
        `script[src="${url}"]`,
      )
      if (script && script.hasAttribute('data-status')) {
        return script.getAttribute('data-status') as ScriptStatus
      }
    }
    return url ? ScriptStatus.LOADING : ScriptStatus.IDLE
  })

  useEffect(() => {
    if (!url) {
      setStatus(ScriptStatus.IDLE)
      return
    }

    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${url}"]`,
    )

    if (!script) {
      script = document.createElement('script')
      script.src = url
      script.async = true
      script.setAttribute('data-status', ScriptStatus.LOADING)
      if (attributes) {
        Object.keys(attributes).forEach(key => {
          script?.setAttribute(key, attributes[key])
        })
      }
      document.head.appendChild(script)

      // Ensure the status is loading
      setStatus(ScriptStatus.LOADING)

      script.onerror = () => {
        if (script) script.setAttribute('data-status', ScriptStatus.ERROR)
      }
      script.onload = () => {
        if (script) script.setAttribute('data-status', ScriptStatus.READY)
      }
    } else if (script.hasAttribute('data-status')) {
      setStatus(script.getAttribute('data-status') as ScriptStatus)
    }

    const eventHandler = (e: Event) => {
      setStatus(e.type === 'load' ? ScriptStatus.READY : ScriptStatus.ERROR)
    }

    // Add load event listener
    script.addEventListener('load', eventHandler)
    script.addEventListener('error', eventHandler)

    return () => {
      if (script) {
        script.removeEventListener('load', eventHandler)
        script.removeEventListener('error', eventHandler)
      }
    }
  }, [url, attributes])

  return [status === ScriptStatus.READY, status]
}