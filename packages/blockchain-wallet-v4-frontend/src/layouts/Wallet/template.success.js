import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import Modals from 'modals'
import Alerts from 'components/Alerts'
import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Faq from 'scenes/Faq'

import TrayRight from './TrayRight'
import { ModalHeader, ModalBody } from 'blockchain-info-components'

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
  z-index: 2;
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

const WalletLayout = (props) => {
  const { location, menuLeftToggled, trayRightOpen, handleTrayRightToggle, handleToggleMenuLeft, handleCloseMenuLeft, children } = props

  return (
    <Wrapper>
      <Alerts />
      <Modals />
      <Nav>
        <Header handleToggleMenuLeft={handleToggleMenuLeft} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen}/>
      </Nav>
      <Container>
        <Left toggled={menuLeftToggled}>
          <MenuLeft location={location} handleToggleMenuLeft={handleToggleMenuLeft} handleCloseMenuLeft={handleCloseMenuLeft} />
        </Left>
        <TrayRight isOpen={trayRightOpen} class='tray' onClose={handleTrayRightToggle}>
          <ModalHeader onClose={handleTrayRightToggle}>
            <FormattedMessage id='layouts.wallet.trayright.faq' defaultMessage='Frequently Asked Questions'/>
          </ModalHeader>
          <ModalBody>
            <Faq />
          </ModalBody>
        </TrayRight>
        <Content>
          <Top>
            <MenuTop />
          </Top>
          <Page location={location}>
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
  handleTrayRightToggle: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  handleCloseMenuLeft: PropTypes.func.isRequired
}

export default WalletLayout
