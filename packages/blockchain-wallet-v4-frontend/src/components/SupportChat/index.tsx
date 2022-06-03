import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

// must be section so global style doesnt overwrite position style
const RelativeWrapper = styled.section`
  position: relative;
`
const AbsoluteWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
`
const Iframe = styled.iframe<{ widgetOpen: boolean }>`
  height: ${(props) => (props.widgetOpen ? '580px' : '60px')};
  width: ${(props) => (props.widgetOpen ? '400px' : '190px')};
  border: none;
`

const SupportChat: React.FC = () => {
  const {
    data: domains = {
      walletHelper: 'https://wallet-helper.blockchain.com'
    },
    isLoading: isDomainsLoading
  } = useRemote(selectors.core.walletOptions.getDomains)
  const { data: userData } = useRemote(selectors.modules.profile.getUserData)

  const [widgetOpen, setWidgetOpen] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(false)
  const dispatch = useDispatch()

  const trackEvent = (widgetOpen: boolean) => {
    if (widgetOpen) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.CUSTOMER_SUPPORT_CLICKED,
          properties: {}
        })
      )
    }
  }

  const updateWidgetState = (e) => {
    const message = e.data
    // HMR/zendesk combo sends empty messages sometimes that result in widget state
    // being set to close when it really is still open
    if (message && typeof message.widgetOpen === 'boolean') {
      setWidgetOpen(message.widgetOpen)
      trackEvent(message.widgetOpen)
    }
  }

  useEffect(() => {
    // listen for messages about widget open/close state
    window.addEventListener('message', updateWidgetState, false)

    return () => {
      window.removeEventListener('message', updateWidgetState, false)
    }
  })

  const postMsgToWalletHelper = (methodName, data) => {
    const zendeskIframe = document.getElementById('zendesk-iframe') as HTMLIFrameElement
    let intervalStarted = false

    const waitForFrameLoad = () => {
      const interval = setInterval(() => {
        setTimeout(function () {
          if (!zendeskIframe || !zendeskIframe.contentWindow) return
          zendeskIframe?.contentWindow.postMessage({ messageData: data, method: methodName }, '*')
          setChatEnabled(true)
        }, 3000)
        clearInterval(interval)
      }, 3000)
    }

    // ensure iframe is loaded before sending message
    if (zendeskIframe?.contentWindow && !intervalStarted) {
      // component renders many times, ensure we only start one poll for the connection
      // eslint-disable-next-line
      intervalStarted = true
      waitForFrameLoad()
    }
  }

  // if we dont have user data or domains are loading return
  if (!userData || isDomainsLoading) return null
  const tier = userData.tiers?.current || 0

  // only show chat to gold users
  if (tier === 2 && !chatEnabled) {
    postMsgToWalletHelper('showChat', {
      email: userData.email,
      fullName:
        userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : ''
    })
  }

  return (
    <RelativeWrapper>
      <AbsoluteWrapper>
        <Iframe
          id='zendesk-iframe'
          src={`${domains.walletHelper}/wallet-helper/zendesk/#/`}
          widgetOpen={widgetOpen}
        />
      </AbsoluteWrapper>
    </RelativeWrapper>
  )
}

export default SupportChat
