import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import SecurityGauge from './SecurityGauge'
import { Icon, Separator, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: uppercase;
  color: ${props => props.theme['gray-4']};
`
const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`
const MenuItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
  margin-bottom: 5px;
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;

  & > span:first-child {
    width: 30px;
    font-size: 20px;
  }

  &.active {  & > * { color: ${props => props.theme['brand-secondary']}; } }
`
const SubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  list-style: none;
  text-transform: none;
  padding: 5px 10px;
  margin-left: 30px;
  margin-top: -15px;
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
        <LinkContainer to='/home' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='home' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.dashboard' defaultMessage='Dashboard' />
          </MenuItem>
        </LinkContainer>
        <MenuItem>
          <Separator align='right'>
            <Text weight={200} size='small'>
              <FormattedMessage id='layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' smaller />
            </Text>
          </Separator>
        </MenuItem>
        <LinkContainer to='/btc/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='bitcoin-in-circle' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.transactions.bitcoin' defaultMessage='Bitcoin' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/eth/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='ethereum' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.transactions.ether' defaultMessage='Ether' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/bch/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='bitcoin-cash' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.transactions.bch' defaultMessage='Bitcoin Cash' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <MenuItem>
          <Separator />
        </MenuItem>
        <LinkContainer to='/buy-sell' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='cart-filled' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy & sell bitcoin' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/exchange' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='exchange-2' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.exchange' defaultMessage='Exchange' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/security-center' activeClassName='active' onClick={handleCloseSettings}>
          <MenuItem>
            <Icon name='lock' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' smaller uppercase />
            <SecurityGauge />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/settings/info' onClick={handleOpenSettings}>
          <MenuItem>
            <Icon name='settings' />
            <FormattedMessage id='layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' smaller uppercase />
          </MenuItem>
        </LinkContainer>
        {settingsToggled && (
          <SubMenu>
            <LinkContainer to='/settings/info' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.general' defaultMessage='General' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/preferences' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' smaller />
              </SubMenuItem>
            </LinkContainer>
            <LinkContainer to='/settings/addresses' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubMenuItem>
                <FormattedMessage id='layouts.wallet.menuleft.navigation.addresses' defaultMessage='Wallets & Addresses' smaller />
              </SubMenuItem>
            </LinkContainer>
          </SubMenu>
        )}
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
