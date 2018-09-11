import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Wrapper,
  MenuItem,
  Separator,
  SubMenu,
  SubMenuItem
} from 'components/MenuLeft'
import { Icon, Text } from 'blockchain-info-components'

const Navigation = props => {
  const {
    menuOpened,
    lockboxOpened,
    settingsOpened,
    handleCloseMenu,
    canTrade,
    pathname,
    lockboxDevices,
    ...rest
  } = props.data

  return (
    <Wrapper {...rest}>
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
          <Icon name='nav-switch' />
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
          <Icon name='bch-circle' />
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
          <Icon name='lock' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.lockbox'
            defaultMessage='Lockbox'
          />
        </MenuItem>
      </LinkContainer>
      {lockboxOpened &&
        lockboxDevices.map(device => {
          const deviceName = device.device_name
          return (
            <SubMenu>
              <LinkContainer
                to={`/lockbox/dashboard/${device.device_id}`}
                activeClassName='active'
              >
                <SubMenuItem>
                  <FormattedMessage
                    id='layouts.wallet.menuleft.navigation.lockbox.device'
                    defaultMessage='{deviceName}'
                    values={{ deviceName }}
                  />
                </SubMenuItem>
              </LinkContainer>
            </SubMenu>
          )
        })}
    </Wrapper>
  )
}

Navigation.propTypes = {
  menuOpened: PropTypes.bool.isRequired,
  settingsOpened: PropTypes.bool.isRequired,
  lockboxOpened: PropTypes.bool.isRequired,
  canTrade: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  pathname: PropTypes.string.isRequired,
  handleCloseMenu: PropTypes.func.isRequired
}

export default Navigation
