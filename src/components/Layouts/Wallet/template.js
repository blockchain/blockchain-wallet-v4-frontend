import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Modals from 'modals'
import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/shared/Alerts'
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
  background-color: #004A7C;
`
const Left = styled.div`
  flex: 0 0 270px;;
  padding: 15px;
  box-sizing: border-box;
  background: #F5F7F9;
  border-right: 1px solid #DDDDDD;

  @media(max-width: 768px) { display: none; }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 270px);

  @media(max-width: 768px) { width: 100%; }
`
const Top = styled.div`
  display: flex;
  height: 115px;
  width: 100%;
`

const WalletLayout = (props) => {
  const { location, children } = props

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
        <Header />
      </Nav>
      <Container>
        <Left>
          <MenuLeft location={location} />
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
