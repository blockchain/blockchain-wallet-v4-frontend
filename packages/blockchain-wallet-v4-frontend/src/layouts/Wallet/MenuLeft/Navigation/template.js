import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'

import { model } from 'data'
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

const { SIDENAV_COIN_LIST } = model.coins
const HelperTipContainer = styled.div`
  margin-left: auto;
`
const NewCartridge = styled(Cartridge)`
  color: #f28b24 !important;
  background-color: ${props => props.theme['white']};
  letter-spacing: 1px;
  margin-left: auto;
  margin-right: -4px;
  padding: 4px 10px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 4px;
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
        </MenuItem>
      </LinkContainer>
      <Separator />
      {values(
        mapObjIndexed(
          (coin, i) => (
            <LinkContainer
              key={i}
              to={coin.txListAppRoute}
              activeClassName='active'
            >
              <MenuItem data-e2e={`${toLower(coin.coinCode)}Link`}>
                <Icon name={coin.icons.circle} />
                {coin.displayName}
                {coin.showNewTagSidenav && (
                  <NewCartridge>
                    <Text color='#F28B24' size='12' weight={500} uppercase>
                      <FormattedMessage
                        id='layouts.wallet.menuleft.navigation.transactions.new'
                        defaultMessage='New'
                      />
                    </Text>
                  </NewCartridge>
                )}
              </MenuItem>
            </LinkContainer>
          ),
          SIDENAV_COIN_LIST
        )
      )}
      <LinkContainer to='/lockbox' activeClassName='active'>
        <MenuItem data-e2e='lockboxLink'>
          <Icon
            name='hardware'
            style={{ fontSize: '20px', paddingLeft: '6px' }}
          />
          <span style={{ marginLeft: '-6px' }}>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.hardware'
              defaultMessage='Hardware'
            />
          </span>
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
