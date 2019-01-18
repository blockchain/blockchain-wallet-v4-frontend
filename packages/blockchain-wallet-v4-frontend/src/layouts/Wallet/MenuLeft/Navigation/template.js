import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Cartridge } from '@blockchain-com/components'
import {
  Wrapper,
  MenuItem,
  Separator,
  SubMenu,
  SubMenuItem
} from 'components/MenuLeft'
import {
  Icon,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'

const HelperTipContainer = styled.div`
  margin-left: auto;
`

const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme['white']} !important;
  background-color: ${props => props.theme['brand-secondary']};
  text-transform: capitalize;
  margin-left: auto;
  margin-right: 5px;
`

const Navigation = props => {
  const { ...rest } = props
  const { lockboxOpened, lockboxDevices } = rest

  return (
    <Wrapper {...rest}>
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
            id='layouts.wallet.menuleft.navigation.buysell'
            defaultMessage='Buy & Sell'
          />
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/swap' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
          <Icon name='nav-switch' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.swap'
            defaultMessage='Swap'
          />
          <NewCartridge>
            <Text color='white' size='12' weight='300'>
              <FormattedMessage
                defaultMessage='New'
                id='layouts.wallet.menuleft.navigation.new'
              />
            </Text>
          </NewCartridge>
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
      <LinkContainer to='/xlm/transactions' activeClassName='active'>
        <MenuItem data-e2e='stellarLink'>
          <Icon name='xlm-circle' />
          <FormattedMessage
            id='layouts.wallet.menuleft.navigation.transactions.xlm'
            defaultMessage='Stellar'
          />
          <NewCartridge>
            <Text color='white' size='12' weight='300'>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.transactions.xlm.new'
                defaultMessage='New'
              />
            </Text>
          </NewCartridge>
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
          <HelperTipContainer>
            <TooltipHost id='lockboxRequired'>
              <TooltipIcon name='info' />
            </TooltipHost>
          </HelperTipContainer>
        </MenuItem>
      </LinkContainer>
      {lockboxOpened && (
        <SubMenu>
          {lockboxDevices.map((device, index) => {
            const deviceName = device.device_name
            return (
              <LinkContainer
                key={index}
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
        </SubMenu>
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
