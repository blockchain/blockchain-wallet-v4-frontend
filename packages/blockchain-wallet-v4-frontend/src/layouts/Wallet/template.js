import React from 'react'
import styled from 'styled-components'

import Modals from 'modals'
import Alerts from 'components/Alerts'
import Tooltips from 'components/Tooltips'
import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import TrayRight from './TrayRight'
import Page from './Page'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Menu from 'scenes/Transactions/Menu'
import ExchangeMenu from 'scenes/Exchange/Menu'
import ExchangeProfileMenu from 'scenes/Settings/Profile/Menu'
import SettingsAddressesMenu from 'scenes/Settings/Addresses/Menu'

import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: ${props => props.theme['brand-primary']};
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 270px);
  background-color: ${props => props.theme['white']};

  @media (max-width: 768px) {
    width: 100%;
  }
`
const Top = styled.div`
  height: 115px;
  width: 100%;
  ${media.mobile`
    height: 150px;
  `};
`

// TODO: @header issue
// change this so that pages control their own scroll
const WalletLayout = props => {
  const { location, children } = props

  return (
    <Wrapper>
      <AnalyticsTracker />
      <ErrorBoundary>
        <Alerts />
        <Tooltips />
        <Modals />
        <Nav>
          <Header />
        </Nav>
        <Container>
          <MenuLeft location={location} />
          <TrayRight />
          <Content>
            <Top>
              <MenuTop />
            </Top>
            {location.pathname.includes('/btc/transactions') && (
              <Menu coin='BTC' />
            )}
            {location.pathname.includes('/bch/transactions') && (
              <Menu coin='BCH' />
            )}
            {location.pathname.includes('/eth/transactions') && (
              <Menu coin='ETH' />
            )}
            {location.pathname.includes('/xlm/transactions') && (
              <Menu coin='XLM' />
            )}
            {location.pathname.includes('/swap') && (
              <ExchangeMenu
                historySelected={location.pathname.includes('/swap/history')}
              />
            )}
            {location.pathname.includes('/settings/addresses') && (
              <SettingsAddressesMenu location={location} />
            )}
            {location.pathname.includes('/settings/profile') && (
              <ExchangeProfileMenu />
            )}
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
