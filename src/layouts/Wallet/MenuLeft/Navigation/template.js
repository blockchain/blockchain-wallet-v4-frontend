import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Menu = styled.ul`
  list-style: none;
  padding: 0;
`
const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  color: #757575;
  cursor: pointer;

  & > :first-child { width: 30px; }
  & > :last-child { text-transform: uppercase; }
  &.active {  & > * { color: #10ADE4; } }
`
const SubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  text-transform: none;
  padding-left: 40px;
`
const SubMenuItem = styled.li`
  padding: 5px 10px;
  margin-right: 10px;
  text-transform: none;
  color: #757575;
  cursor: pointer;

  &.active {  & > * { color: #10ADE4; } }
`

const Navigation = (props) => {
  const { settingsToggled, handleOpenSettings, handleCloseSettings, handleCloseMenuLeft, ...rest } = props

  return (
    <Wrapper {...rest}>
      <Menu>
        <LinkContainer to='/wallet' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='home' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='tx' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/buy-sell' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='bitcoin' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy bitcoin' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/security-center' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='lock' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/settings' activeClassName='active' onClick={handleOpenSettings}>
          <MenuItem>
            <Icon name='settings' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        {settingsToggled && (
          <SubMenu>
            <LinkContainer to='/settings/info' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/preferences' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/security' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.security' defaultMessage='Security' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/addresses' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' smaller />
              </SubMenuItem>
            </LinkContainer>
          </SubMenu>
        )}
        <LinkContainer to='/faq' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='help' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' smaller uppercase />
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
