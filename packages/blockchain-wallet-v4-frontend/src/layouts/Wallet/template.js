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

import BtcMenu from 'scenes/Transactions/Btc/Menu'
import BchMenu from 'scenes/Transactions/Bch/Menu'
import EthMenu from 'scenes/Transactions/Eth/Menu'
import AddrMenu from 'scenes/Settings/Addresses/Menu'
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
            {location.pathname === '/btc/transactions' && <BtcMenu />}
            {location.pathname === '/bch/transactions' && <BchMenu />}
            {location.pathname === '/eth/transactions' && <EthMenu />}
            {location.pathname === '/settings/addresses' && <AddrMenu />}
            {location.pathname === '/settings/addresses/bch' && <AddrMenu />}
            {location.pathname === '/exchange' && <ExchangeMenu />}
            {location.pathname === '/exchange/history' && <ExchangeMenu />}
            <Page>{children}</Page>
          </Content>
        </Container>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default WalletLayout
