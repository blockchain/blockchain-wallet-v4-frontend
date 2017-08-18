import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import WhatsNew from './WhatsNew'
import Refresh from './Refresh'
import Logout from './Logout'

import { Image } from 'blockchain-info-components'

const Wrapper = styled.div`
  & .navbar-header {  height: 60px; }
  & .navbar-inverse { margin: 0; }
`
const Logo = styled(Image)`
  margin-top: 18px;
`
const MenuLeftToggler = styled.button`
  display: block;
  margin-top: 4px;
  margin-right: 10px;
  float: left;
  cursor: pointer;
  padding: 9px 10px;
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;

  @media(min-width: 768px) { display: none; }
`

const MenuLeftTogglerBar = styled.span`
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 1px;
  margin-top: 4px;
  background-color: #FFFFFF;
`

const Header = (props) => {
  const { navigationToggled, handleToggleNavigation, handleToggleMenuLeft } = props
  return (
    <Wrapper>
      <Navbar fluid inverse defaultExpanded={navigationToggled}>
        <Navbar.Header>
          <MenuLeftToggler onClick={handleToggleMenuLeft}>
            <MenuLeftTogglerBar />
            <MenuLeftTogglerBar />
            <MenuLeftTogglerBar />
          </MenuLeftToggler>
          <Navbar.Brand>
            <LinkContainer to='/'>
              <Logo name='blockchain-vector' height='20px' />
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle onClick={handleToggleNavigation} />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <Ticker />
            <ExploreMenu />
            <WhatsNew />
            <Refresh />
            <Logout />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Wrapper>
  )
}

Header.propTypes = {
  handleToggleNavigation: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  navigationToggled: PropTypes.bool.isRequired
}

export default Header
