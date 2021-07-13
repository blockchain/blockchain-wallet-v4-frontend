/* eslint-disable */
import React, { useEffect, useState } from 'react'

import { Button } from 'blockchain-info-components'

type PromptType = {
  prompt?: () => void
  userChoice?: Promise<{ outcome: string }>
}

// https://developers.google.com/web/fundamentals/app-install-banners/native
const AndroidAppBanner = () => {
  const [installPromptDeffered, setInstallPromptDeffered] = useState<
    PromptType
  >({})
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    console.log('component mounted')
    window.addEventListener('beforeinstallprompt', e => {
      console.log('beforeinstallprompt run')
      e.preventDefault()
      setInstallPromptDeffered(e)
      setShowPrompt(true)
    })
  }, [])

  const handleInstallClick = () => {
    // hide our user interface that shows our A2HS button
    setShowPrompt(false)
    // show the prompt from google
    installPromptDeffered.prompt && installPromptDeffered.prompt()
    // wait for user response
    installPromptDeffered.userChoice &&
      installPromptDeffered.userChoice.then(resp => {
        console.log('user response', resp)
        if (resp.outcome === 'accepted') {
          window.alert('User accepted install')
        } else {
          window.alert('User dismissed install')
        }
        setInstallPromptDeffered({})
      })
  }
  return showPrompt ? (
    <div>
      <Button
        capitalize
        data-e2e='installAndroidAppBtn'
        fullwidth
        height='48px'
        nature='secondary'
        onClick={handleInstallClick}
        size='16px'
      >
        Install Android App
      </Button>
    </div>
  ) : null
}

export default AndroidAppBanner
