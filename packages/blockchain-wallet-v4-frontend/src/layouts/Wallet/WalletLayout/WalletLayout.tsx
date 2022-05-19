import React from 'react'
import { replace } from 'ramda'

import Alerts from 'components/Alerts'
import Announcements from 'components/Announcements'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../../modals'
import MenuLeft from '../MenuLeft'
import MenuTop from '../MenuTop'
import Page from '../Page'
import { Container, Content, Nav, Wrapper } from './WalletLayout.styles'
import { WalletLayoutComponent } from './WalletLayout.types'

const WalletLayout: WalletLayoutComponent = ({
  center = false,
  children,
  hideMenu = false,
  pathname
}) => (
  <Wrapper>
    <ErrorBoundary>
      <Alerts />
      <Tooltips />
      <Modals />
      <Nav>
        <MenuTop />
        <Announcements type='service' alertArea='wallet' />
        <Announcements type='static' />
      </Nav>
      <Container>
        {hideMenu ? null : <MenuLeft />}
        <Content center={center} data-e2e={`page${replace(/\//g, '-', pathname)}`}>
          <Page center={center}>{children}</Page>
        </Content>
      </Container>
    </ErrorBoundary>
  </Wrapper>
)

export default WalletLayout
