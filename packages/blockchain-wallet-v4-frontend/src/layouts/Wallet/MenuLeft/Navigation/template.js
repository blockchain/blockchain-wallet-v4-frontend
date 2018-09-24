import React from 'react'
import styled from 'styled-components'
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

const LockboxSubMenu = styled(SubMenu)`
  width: 100%;
  margin-left: 40px;
`
const Navigation = props => {
  const { logClick, lockboxOpened, lockboxDevices, ...rest } = props.data

  return (
    <Wrapper {...rest} onClick={logClick}>
      {/* If updating navigation item names dont forget to update analytics saga */}
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <Icon name='nav-home' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.dashboard'
            defaultMessage='Dashboard'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/buy-sell' activeClassName='active'>
        <MenuItem data-e2e='buyAndSellLink'>
          <Icon name='nav-buy' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.buybitcoin'
            defaultMessage='Buy & Sell'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/exchange' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
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
        <MenuItem data-e2e='bitcoinLink'>
          <Icon name='btc-circle' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.transactions.bitcoin'
            defaultMessage='Bitcoin'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/eth/transactions' activeClassName='active'>
        <MenuItem data-e2e='etherLink'>
          <Icon name='eth-circle' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.transactions.ether'
            defaultMessage='Ether'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/bch/transactions' activeClassName='active'>
        <MenuItem data-e2e='bitcoinCashLink'>
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
        <MenuItem data-e2e='lockboxLink'>
          <Icon name='lock' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.lockbox'
            defaultMessage='Lockbox'
          />
        </MenuItem>
      </LinkContainer>
      {lockboxOpened && (
        <LockboxSubMenu>
          {lockboxDevices.map((device, index) => {
            const deviceName = device.device_name
            return (
              <LinkContainer
                activeClassName='active'
                to={`/lockbox/dashboard/${index}`}
                isActive={() => rest.pathname.includes(index)}
              >
                <SubMenuItem>
                  <FormattedMessage
                    id='layouts.wallet.menuleft.navigation.lockbox.device'
                    defaultMessage='{deviceName}'
                    values={{ deviceName }}
                  />
                </SubMenuItem>
              </LinkContainer>
            )
          })}
        </LockboxSubMenu>
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
