import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

import { Button, Image, Text } from 'blockchain-info-components'
import RouterLink from 'components/RouterLink'

const Wrapper = styled.div`
  padding-top: 17px;
  padding-left: 15px;fblockchain-vector
  padding-right: 15px;
  & .navbar-header { height: 60px; }
  & .navbar-right {
    & > li { padding-top: 0; }
    @media (min-width: 768px) and (max-width: 1200px) { display: none; } 
  }
`
const Logo = styled(Image)`
  margin: 15px;
`
const Header = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Wrapper>
      <Navbar inverse defaultExpanded={toggled}>
        <Navbar.Header>
          <Navbar.Brand>
            <RouterLink to='/'><Logo name='blockchain-vector' height='22px' /></RouterLink>
          </Navbar.Brand>
          <Navbar.Toggle onClick={handleToggle} />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <RouterLink to='/wallet'>
              <NavItem>
                <Text color='white' uppercase>
                  <FormattedMessage id='components.layouts.landing.header.wallets' defaultMessage='Wallets' />
                </Text>
              </NavItem>
            </RouterLink>
            <NavItem href='https://blockchain.info/charts' target='_blank'>
              <Text color='white' uppercase>
                <FormattedMessage id='components.layouts.landing.header.charts' defaultMessage='Charts' />
              </Text>
            </NavItem>
            <NavItem href='https://blockchain.info/stats' target='_blank'>
              <Text color='white' uppercase>
                <FormattedMessage id='components.layouts.landing.header.stats' defaultMessage='Stats' />
              </Text>
            </NavItem>
            <NavItem href='https://blockchain.info/markets' target='_blank'>
              <Text color='white' uppercase>
                <FormattedMessage id='components.layouts.landing.header.markets' defaultMessage='Markets' />
              </Text>
            </NavItem>
            <NavItem href='https://blockchain.info/api' target='_blank'>
              <Text color='white' uppercase>
                <FormattedMessage id='components.layouts.landing.header.api' defaultMessage='Api' />
              </Text>
            </NavItem>
          </Nav>
          <Nav pullRight>
            <RouterLink to='/login'>
              <NavItem>
                <Button nature='primary' uppercase rounded>
                  <FormattedMessage id='components.layouts.landing.header.login' defaultMessage='Log in' />
                </Button>
              </NavItem>
            </RouterLink>
            <RouterLink to='/register'>
              <NavItem>
                <Button nature='secondary' uppercase rounded>
                  <FormattedMessage id='components.layouts.landing.header.signup' defaultMessage='Sign up' />
                </Button>
              </NavItem>
            </RouterLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Wrapper>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default Header
