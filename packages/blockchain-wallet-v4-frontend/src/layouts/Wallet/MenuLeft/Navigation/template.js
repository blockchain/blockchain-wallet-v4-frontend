import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme['gray-4']};
`
const Menu = styled.ul`
  list-style: none;
  padding: 0;
`
const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 0;
  box-sizing: border-box;
  cursor: pointer;

  & > :first-child { width: 30px; font-size: 20px; }
  & > :last-child { text-transform: uppercase; }
  &.active {  & > * { color: ${props => props.theme['brand-secondary']}; } }
`
const SubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  text-transform: none;
  padding: 0;
  margin-left: 30px;
`
const SubMenuItem = styled.li`
  padding: 5px 0;
  box-sizing: border-box;
  text-transform: none;
  cursor: pointer;

  &.active {  & > * { color: ${props => props.theme['brand-secondary']}; } }
`

const Navigation = (props) => {
  const { settingsToggled, handleOpenSettings, handleCloseSettings, handleCloseMenuLeft, ...rest } = props

  return (
    <Wrapper {...rest}>
      <Menu>
        <LinkContainer to='/wallet' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='home' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='transactions' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/buy-sell' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='bitcoin' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy & sell bitcoin' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/exchange' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='exchange' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.exchange' defaultMessage='Exchange' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/security-center' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='lock' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/settings' activeClassName='active' onClick={handleOpenSettings}>
          <MenuItem>
            <Icon name='settings' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        {settingsToggled && (
          <SubMenu>
            <LinkContainer to='/settings/info' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/preferences' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/security' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.security' defaultMessage='Security' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/addresses' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' smaller />
              </SubMenuItem>
            </LinkContainer>
          </SubMenu>
        )}
        <LinkContainer to='/faq' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='question-in-circle' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' smaller uppercase />
          </MenuItem>
        </LinkContainer>
      </Menu>
    </Wrapper>
  )
}

Navigation.propTypes = {
  settingsToggled: PropTypes.bool.isRequired,
  handleOpenSettings: PropTypes.func.isRequired,
  handleCloseSettings: PropTypes.func.isRequired,
  handleCloseMenuLeft: PropTypes.func.isRequired
}

export default Navigation
