import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { trackEvent } from 'data/analytics/slice'
import { getUserData } from 'data/modules/profile/selectors'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { ZendeskIframe } from '../ZendeskIframe'

const iframeId = 'zendesk-iframe'

export const SupportChatForGoldUserOnly = () => {
  const portalElement = document.getElementById('contact-chat-portal')
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const { data: userData } = useRemote(getUserData)
  const { data: domains } = useRemote(getDomains)

  const trackCustomerSupportClickedEvent = useCallback(() => {
    dispatch(
      trackEvent({
        key: Analytics.CUSTOMER_SUPPORT_CLICKED,
        properties: {}
      })
    )
  }, [dispatch])

  const isGoldUser = useMemo(() => userData?.tiers?.current === 2, [userData])

  const sendMessage = useCallback(
    async (methodName: string, data: unknown) => {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement

      if (!iframe?.contentWindow) {
        console.warn('No Wallet Helper iframe')
        return
      }

      iframe.contentWindow.postMessage({ messageData: data, method: methodName }, '*')
    },
    [iframeId]
  )

  const iframeSrc = useMemo(() => {
    if (!domains) return 'https://wallet-helper.blockchain.com'

    return `${domains.walletHelper}/wallet-helper/zendesk/#/`
  }, [domains])

  const onMessage = (message: MessageEvent) => {
    if (domains?.walletHelper && !message.origin.includes(domains?.walletHelper)) return

    if (typeof message.data.widgetOpen === 'boolean') {
      setIsOpen(message.data.widgetOpen)
      message.data.widgetOpen && trackCustomerSupportClickedEvent()
    }

    if (message.data.widgetReady) {
      if (!userData) return

      sendMessage('showChat', {
        email: userData.email,
        fullName: userData.firstName + ' ' + userData.lastName
      })
    }
  }

  useEffect(() => {
    window.addEventListener('message', onMessage, false)
    return () => {
      window.removeEventListener('message', onMessage, false)
    }
  }, [])

  if (!userData || !portalElement || !isGoldUser) return null

  return createPortal(
    <ZendeskIframe id={iframeId} src={iframeSrc} isOpen={isOpen} />,
    portalElement
  )
}
