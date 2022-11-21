import React, { useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'

import {
  useSupportChatAvailability,
  useSupportChatMessage,
  useSupportChatOpenState
} from 'components/SupportChat/hooks'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { ZendeskIframe } from '../ZendeskIframe'
import { SupportChatForGoldUserOnlyComponent } from './SupportChatForGoldUserOnly.types'

export const SupportChatForGoldUserOnly: SupportChatForGoldUserOnlyComponent = () => {
  const iframeId = 'zendesk-iframe'
  const portalElement = document.getElementById('contact-chat-portal')
  const dispatch = useDispatch()

  const [isOpen] = useSupportChatOpenState()
  const { data: userData } = useRemote(selectors.modules.profile.getUserData)
  const { isAvailable } = useSupportChatAvailability({ iframeId })
  const { data: domains } = useRemote(selectors.core.walletOptions.getDomains)

  const { sendMessage } = useSupportChatMessage({
    iframeId
  })

  const trackCustomerSupportClickedEvent = useCallback(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.CUSTOMER_SUPPORT_CLICKED,
        properties: {}
      })
    )
  }, [dispatch])

  const isGoldUser = useMemo(() => userData?.tiers?.current === 2, [userData])

  const userFullname = useMemo(
    () => userData?.firstName && userData.lastName && `${userData.firstName} ${userData.lastName}`,
    [userData]
  )

  const iframeSrc = useMemo(() => {
    if (!domains) return 'https://wallet-helper.blockchain.com'

    return `${domains.walletHelper}/wallet-helper/zendesk/#/`
  }, [domains])

  useEffect(() => {
    if (isOpen) {
      trackCustomerSupportClickedEvent()
    }
  }, [isOpen, trackCustomerSupportClickedEvent])

  useEffect(() => {
    if (isGoldUser && userData && isAvailable) {
      // FIXME: adding a 7 second delay because sendMessage was preiously firing before react was loaded
      // in the iframe and the chat button wasn't showing up. The proper solution should wait for the iframe
      // to tell wallet that it's loaded properly and will receive this message.
      setTimeout(() => {
        sendMessage('showChat', {
          email: userData.email,
          fullName: userFullname
        })
      }, 7000)
    }
  }, [userData, isAvailable, sendMessage, isGoldUser, userFullname])

  if (!userData || !portalElement) return null

  return createPortal(
    <ZendeskIframe id={iframeId} src={iframeSrc} isOpen={isOpen} />,
    portalElement
  )
}
