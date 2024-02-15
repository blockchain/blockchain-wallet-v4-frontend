import React from 'react'
import styled from 'styled-components'

import Alerts from 'components/Alerts'
import { ServiceAnnouncement, StaticAnnouncement } from 'components/Announcements'
import { UkBanner } from 'components/Banner'
import Tooltips from 'components/Tooltips'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Modals from '../../modals'
import MenuTop from '../Wallet/MenuTop'
import { Nav, Wrapper } from '../Wallet/WalletLayout/WalletLayout.styles'

const Page = styled.div`
  box-sizing: border-box;
  background: ${(props) => props.theme.white};
  > div:first-child {
    z-index: 1;
    position: relative;
    border-top: 0px;
  }
`

const NftsTemplate: React.FC<any> = (props) => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Alerts />
        <Nav>
          <MenuTop />
          <UkBanner />
          <ServiceAnnouncement alertArea='wallet' />
          <StaticAnnouncement />
        </Nav>
        <Tooltips />
        <Modals />
        <Page>{props.children}</Page>
      </Wrapper>
    </ErrorBoundary>
  )
}

export default NftsTemplate
