import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Modals from 'modals'
import Alerts from 'components/Alerts'
import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import TrayRight from './TrayRight'
import Page from './Page'

import BtcMenu from '../../scenes/Transactions/Bitcoin/Menu'
import BchMenu from '../../scenes/Transactions/Bch/Menu'
import EthMenu from '../../scenes/Transactions/Ether/Menu'
import AddrMenu from '../../scenes/Settings/Addresses/Menu'
import ExchangeMenu from '..//Exchange'
import Exchange from '../../scenes/Exchange';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
const Nav = styled.div`
  flex: 0 0 60px;
  background-color: ${props => props.theme['brand-primary']};
`
const Left = styled.div`
  display: flex;
  position: absolute;

  left: ${props => props.toggled ? '0' : '-270px'};
  width: 270px;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: ${props => props.theme['white-blue']};
  border-right: 1px solid ${props => props.theme['gray-1']};
  z-index: 8;
  transition: left .3s ease-in-out;

  @media(min-width: 768px) {
    display: flex;
    flex: 0 0 270px;
    position: relative;
    top: initial;
    left: initial;
  }
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 270px);
  background-color: ${props => props.theme['white']};

  @media(max-width: 768px) { width: 100%; }
`
const Top = styled.div`
  display: flex;
  height: 115px;
  width: 100%;
`

const WalletLayout = props => {
  const { location, partner, menuLeftToggled, trayRightOpen, handleTrayRightToggle, handleToggleMenuLeft, handleCloseMenuLeft, children, trayRightContent } = props

  return (
    <Wrapper>
      <Alerts />
      <Modals />
      <Nav>
        <Header trayRightContent={trayRightContent} handleToggleMenuLeft={handleToggleMenuLeft} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen} />
      </Nav>
      <Container>
        <Left toggled={menuLeftToggled}>
          <MenuLeft location={location} handleToggleMenuLeft={handleToggleMenuLeft} handleCloseMenuLeft={handleCloseMenuLeft} partner={partner} />
        </Left>
        <TrayRight isOpen={trayRightOpen} class='tray' handleTrayRightToggle={handleTrayRightToggle} trayRightContent={trayRightContent} />
        <Content>
          <Top>
            <MenuTop />
          </Top>
          { location.pathname === '/btc/transactions' && <BtcMenu /> }
          { location.pathname === '/bch/transactions' && <BchMenu /> }
          { location.pathname === '/eth/transactions' && <EthMenu /> }
          { location.pathname === '/settings/addresses' && <AddrMenu /> }
          { location.pathname === '/settings/addresses/bch' && <AddrMenu /> }
          { location.pathname === '/exchange' && <ExchangeMenu /> }
          { location.pathname === '/exchange/history' && <ExchangeMenu /> }
          <Page>
            {children}
          </Page>
        </Content>
      </Container>
    </Wrapper>
  )
}

WalletLayout.propTypes = {
  location: PropTypes.object.isRequired,
  menuLeftToggled: PropTypes.bool.isRequired,
  trayRightOpen: PropTypes.bool.isRequired,
  trayRightContent: PropTypes.string.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  handleCloseMenuLeft: PropTypes.func.isRequired
}

export default WalletLayout
