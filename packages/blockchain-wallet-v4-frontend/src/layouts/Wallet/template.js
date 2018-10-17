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
import ErrorBoundary from 'providers/ErrorBoundaryProvider'

import Menu from 'scenes/Transactions/Menu'
import AddrMenu from 'scenes/Settings/Addresses/Menu'
import LockboxMenu from '../../scenes/Lockbox/Menu'
import ExchangeMenu from 'scenes/Exchange/Menu'

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
            {location.pathname === '/settings/addresses/btc' && <AddrMenu />}
            {location.pathname === '/settings/addresses/bch' && <AddrMenu />}
            {location.pathname.includes('/btc/transactions') && (
              <Menu coin='BTC' />
            )}
            {location.pathname.includes('/bch/transactions') && (
              <Menu coin='BCH' />
            )}
            {location.pathname.includes('/eth/transactions') && (
              <Menu coin='ETH' />
            )}
            {location.pathname.includes('/exchange') && (
              <ExchangeMenu
                historySelected={location.pathname.includes(
                  '/exchange/history'
                )}
              />
            )}
            {location.pathname.includes('/lockbox') && <LockboxMenu />}
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
