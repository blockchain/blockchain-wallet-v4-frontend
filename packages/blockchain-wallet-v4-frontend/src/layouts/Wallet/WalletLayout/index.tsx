import React, { ReactElement } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { useDispatch, useSelector } from 'react-redux'

import Alerts from 'components/Alerts'
import { ServiceAnnouncement, StaticAnnouncement } from 'components/Announcements'
import { SofiBanner, UkBanner, UkFooterBanner } from 'components/Banner'
import { CowboysCardComponent } from 'components/Card/CowboysCard'
import ExchangePromo from 'components/Card/ExchangePromo'
import { SupportChatForGoldUserOnly } from 'components/SupportChat'
import Tooltips from 'components/Tooltips'
import { ModalName } from 'data/types'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../../modals'
import MenuLeft from '../MenuLeft'
import MenuTop from '../MenuTop'
import { Container, Content, Nav, PageContent, Wrapper } from './WalletLayout.styles'
import { modals } from 'data/actions'
import { RootState } from 'data/rootReducer'
import { getAutoLogoutTime } from '@core/redux/wallet/selectors'

const WalletLayout = ({
  approvalDate,
  center = false,
  children,
  hasUkBanner,
  hideMenu = false,
  pathname,
  removeContentPadding
}: Props) => {
  const dispatch = useDispatch()

  const autoLogoutTimeLength = useSelector((state: RootState) => getAutoLogoutTime(state)) as number

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
        modals.showModal(ModalName.AUTO_DISCONNECTION_MODAL, {
          duration: idleTimeInMinutes,
          origin: 'Unknown'
        })
      )
    },
    timeout: autoLogoutTimeLength
  })

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
          <SofiBanner />
          <UkBanner />
          <ServiceAnnouncement alertArea='wallet' />
          <StaticAnnouncement />
        </Nav>
        <Container>
          {!hideMenu && <MenuLeft />}
          <Content
            center={center}
            removeContentPadding={removeContentPadding}
            data-e2e={`page${pathname.replace(/\//g, '-')}`}
          >
            <PageContent center={center}>{children}</PageContent>
            {hasUkBanner && <UkFooterBanner approvalDate={approvalDate} />}
          </Content>
        </Container>
        <SupportChatForGoldUserOnly />
      </ErrorBoundary>
    </Wrapper>
  )
}

type Props = {
  approvalDate?: string
  center?: boolean
  children: ReactElement
  hasUkBanner?: boolean
  hideMenu?: boolean
  pathname: string
  removeContentPadding?: boolean
}

export default WalletLayout
