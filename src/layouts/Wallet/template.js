import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Modals from 'modals'
import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/Alerts'
import AutoDisconnection from 'modals/AutoDisconnection'
import PairingCode from 'modals/PairingCode'
import QRCode from 'modals/QRCode'
import QRCodeCapture from 'modals/QRCodeCapture'
import RequestBitcoin from 'modals/RequestBitcoin'
import SecondPassword from 'modals/SecondPassword'
import SendBitcoin from 'modals/SendBitcoin'

import Page from './Page'

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
  background-color: ${props => props.theme['blue']};
`
const Left = styled.div`
  display: flex;
  position: absolute;
  top: 60px;
  left: ${props => props.toggled ? '0' : '-270px'};
  width: 270px;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: ${props => props.theme['grey']};
  border-right: 1px solid ${props => props.theme['bordergrey']};
  z-index: 1000;
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

const WalletLayout = (props) => {
  const { location, menuLeftToggled, handleToggleMenuLeft, handleCloseMenuLeft, children } = props

  return (
    <Wrapper>
      <Alerts />
      <Modals>
        <AutoDisconnection />
        <PairingCode />
        <QRCode />
        <QRCodeCapture />
        <RequestBitcoin />
        <SecondPassword />
        <SendBitcoin />
      </Modals>
      <Nav>
        <Header handleToggleMenuLeft={handleToggleMenuLeft} />
      </Nav>
      <Container>
        <Left toggled={menuLeftToggled}>
          <MenuLeft location={location} handleToggleMenuLeft={handleToggleMenuLeft} handleCloseMenuLeft={handleCloseMenuLeft} />
        </Left>
        <Content>
          <Top>
            <MenuTop />
          </Top>
          <Page>
            {children}
          </Page>
        </Content>
      </Container>
    </Wrapper>
  )
}

WalletLayout.propTypes = {
  location: PropTypes.object.isRequired
}

export default WalletLayout
