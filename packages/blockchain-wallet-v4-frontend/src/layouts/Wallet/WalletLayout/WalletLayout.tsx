import React, { FC } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useLocation } from 'react-router-dom'
import { replace } from 'ramda'

import Alerts from 'components/Alerts'
import Announcements from 'components/Announcements'
import { CowboysCardComponent } from 'components/Card/CowboysCard'
import ExchangePromo from 'components/Card/ExchangePromo'
import { SupportChatForGoldUserOnly } from 'components/SupportChat'
import Tooltips from 'components/Tooltips'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../../modals'
import MenuLeft from '../MenuLeft'
import MenuTop from '../MenuTop'
import Page from '../Page'
import { Container, Content, Nav, Wrapper } from './WalletLayout.styles'

const WalletLayout: Props = ({ children, removeContentPadding }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const autoLogoutTimeLength = useSelector(
    (state: RootState) => selectors.core.wallet.getAutoLogoutTime(state) as number
  )
  const isAuthenticated = useSelector(selectors.auth.isAuthenticated)
  useIdleTimer({
    element: document,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],
    eventsThrottle: 5_000, // throttle event detection to 5 seconds
    onIdle: () => {
      const idleTimeInMinutes = autoLogoutTimeLength / 60_000
      dispatch(
        actions.modals.showModal(ModalName.AUTO_DISCONNECTION_MODAL, {
          duration: idleTimeInMinutes,
          origin: 'Unknown'
        })
      )
    },
    timeout: autoLogoutTimeLength
  })

  if (!isAuthenticated) {
    redirect('/login')
    return null
  }

  return (
    <Wrapper>
      <ErrorBoundary>
        <Alerts />
        <Tooltips />
        <Modals />
        <CowboysCardComponent />
        <ExchangePromo />
        <Nav>
          <MenuTop />
          <Announcements type='service' alertArea='wallet' />
          <Announcements type='static' />
        </Nav>
        <Container>
          <MenuLeft />
          <Content
            removeContentPadding={removeContentPadding}
            data-e2e={`page${replace(/\//g, '-', location.pathname)}`}
          >
            <Page>{children}</Page>
          </Content>
        </Container>
        <SupportChatForGoldUserOnly />
      </ErrorBoundary>
    </Wrapper>
  )
}

type Props = FC<{
  hideMenu?: boolean
  removeContentPadding?: boolean
}>

export default WalletLayout
