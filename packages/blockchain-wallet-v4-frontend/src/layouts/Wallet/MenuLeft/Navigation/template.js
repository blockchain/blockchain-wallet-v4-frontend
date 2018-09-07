import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-transform: ;
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
  font-size: 14px;
  width: 100%;

  & > span:first-child {
    width: 30px;
    font-size: 24px;
    margin-right: 5px;
  }

  &.active {
    & > * {
      color: ${props => props.theme['brand-secondary']};
    }
  }
`

const Separator = styled.div`
  margin-top: 30px;
`

const Navigation = props => {
  const {
    menuOpened,
    settingsOpened,
    handleCloseMenu,
    canTrade,
    userFlowSupported,
    pathname,
    ...rest
  } = props

  return (
    <Wrapper {...rest}>
      <Menu>
        <LinkContainer to='/home' activeClassName='active'>
          <MenuItem>
            <Icon name='nav-home' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.dashboard'
              defaultMessage='Dashboard'
            />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/buy-sell' activeClassName='active'>
          <MenuItem>
            <Icon name='nav-buy' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.buybitcoin'
              defaultMessage='Buy & Sell'
            />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/exchange' activeClassName='active'>
          <MenuItem>
            <Icon name='nav-exchange' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.exchange'
              defaultMessage='Exchange'
            />
          </MenuItem>
        </LinkContainer>
        <MenuItem>
          <Separator>
            <Text size='14px' weight={400} uppercase>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.transactions'
                defaultMessage='Transactions'
              />
            </Text>
          </Separator>
        </MenuItem>
        <LinkContainer to='/btc/transactions' activeClassName='active'>
          <MenuItem>
            <Icon name='btc-circle' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.transactions.bitcoin'
              defaultMessage='Bitcoin'
            />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/eth/transactions' activeClassName='active'>
          <MenuItem>
            <Icon name='eth-circle' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.transactions.ether'
              defaultMessage='Ether'
            />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to='/bch/transactions' activeClassName='active'>
          <MenuItem>
            <Icon name='bch-border' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.transactions.bch'
              defaultMessage='Bitcoin Cash'
            />
          </MenuItem>
        </LinkContainer>
        <MenuItem>
          <Separator>
            <Text size='14px' weight={400} uppercase>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.storage'
                defaultMessage='Storage'
              />
            </Text>
          </Separator>
        </MenuItem>
        <LinkContainer to='/lockbox' activeClassName='active'>
          <MenuItem>
            <Icon name='lock-filled' />
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.lockbox'
              defaultMessage='Lockbox'
            />
          </MenuItem>
        </LinkContainer>
      </Menu>
    </Wrapper>
  )
}

Navigation.propTypes = {
  menuOpened: PropTypes.bool.isRequired,
  settingsOpened: PropTypes.bool.isRequired,
  canTrade: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  pathname: PropTypes.string.isRequired,
  handleCloseMenu: PropTypes.func.isRequired
}

export default Navigation
