import React, { useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'

import {
  useSupportChatAvailability,
  useSupportChatMessage,
  useSupportChatState
} from 'components/SupportChat/hooks'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { IntercomIframe } from '../IntercomIframe'
import { SupportChatForGoldUserOnlyComponent } from './SupportChatForGoldUserOnly.types'

export const SupportChatForGoldUserOnly: SupportChatForGoldUserOnlyComponent = () => {
  const iframeId = 'bcdc-intercom-iframe'
  const portalElement = document.getElementById('contact-chat-portal')
  const dispatch = useDispatch()

  const [{ isOpen, isReady }] = useSupportChatState()
  const { data: userData } = useRemote(selectors.modules.profile.getUserData)
  const { isAvailable } = useSupportChatAvailability({ iframeId })
  const { data: domains } = useRemote(selectors.core.walletOptions.getDomains)

  const { sendMessage } = useSupportChatMessage({ iframeId })

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

    return `${domains.walletHelper}/wallet-helper/intercom/#/`
  }, [domains])

  useEffect(() => {
    if (isOpen) {
      trackCustomerSupportClickedEvent()
    }
  }, [isOpen, trackCustomerSupportClickedEvent])

  useEffect(() => {
    if (isGoldUser && userData && isAvailable && isReady) {
      sendMessage('boot', {
        background_color: 'red',
        email: userData?.email,
        name: userFullname
      })
    }
  }, [userData, isReady, sendMessage, isGoldUser, isAvailable, userFullname])

  if (!userData || !portalElement) return null

  return createPortal(
    <IntercomIframe id={iframeId} src={iframeSrc} isOpen={isOpen} />,
    portalElement
  )
}
