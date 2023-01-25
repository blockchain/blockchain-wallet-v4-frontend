import React, { FC, ReactElement } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { connect, ConnectedProps } from 'react-redux'
import { replace } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import Alerts from 'components/Alerts'
import Announcements from 'components/Announcements'
import { CowboysCardComponent } from 'components/Card/CowboysCard'
import ExchangePromo from 'components/Card/ExchangePromo'
import { SupportChatForGoldUserOnly } from 'components/SupportChat'
import Tooltips from 'components/Tooltips'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../../modals'
import MenuLeft from '../MenuLeft'
import MenuTop from '../MenuTop'
import Page from '../Page'
import { Container, Content, Nav, Wrapper } from './WalletLayout.styles'

const WalletLayout: Props = ({
  autoLogoutTimeLength,
  center = false,
  children,
  hideMenu = false,
  modalActions,
  pathname,
  removeContentPadding
}) => {
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
      modalActions.showModal(ModalName.AUTO_DISCONNECTION_MODAL, {
        duration: idleTimeInMinutes,
        origin: 'Unknown'
      })
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
          <Announcements type='service' alertArea='wallet' />
          <Announcements type='static' />
        </Nav>
        <Container>
          {hideMenu ? null : <MenuLeft />}
          <Content
            center={center}
            removeContentPadding={removeContentPadding}
            data-e2e={`page${replace(/\//g, '-', pathname)}`}
          >
            <Page center={center}>{children}</Page>
          </Content>
        </Container>
        <SupportChatForGoldUserOnly />
      </ErrorBoundary>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  autoLogoutTimeLength: selectors.core.wallet.getAutoLogoutTime(state) as number
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = FC<
  {
    center?: boolean
    children: ReactElement
    hideMenu?: boolean
    pathname: string
    removeContentPadding?: boolean
  } & ConnectedProps<typeof connector>
>

export default connector(WalletLayout)
