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
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme['white']} !important;
  background-color: ${props => props.theme['brand-secondary']};
`

const Navigation = props => {
  const { logClick, ...rest } = props
  const { lockboxOpened, lockboxDevices, lockboxEnabled } = rest

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
            id='layouts.wallet.menuleft.navigation.buysell'
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
          <NewCartridge>
            <FormattedMessage
              defaultMessage='New'
              id='layouts.wallet.menuleft.navigation.new'
            />
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
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.transactions.xlm.new'
              defaultMessage='New'
            />
          </NewCartridge>
        </MenuItem>
      </LinkContainer>
      {lockboxEnabled && (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
