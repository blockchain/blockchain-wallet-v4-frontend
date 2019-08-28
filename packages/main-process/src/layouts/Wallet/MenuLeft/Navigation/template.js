import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { mapObjIndexed, toLower, values } from 'ramda'

import { Cartridge } from '@blockchain-com/components'
import {
  CoinIcon,
  Destination,
  MenuIcon,
  MenuItem,
  Separator,
  // SubMenu,
  // SubMenuItem,
  Wrapper
} from 'components/MenuLeft'
import {
  Link,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'

const HelperTipContainer = styled.div`
  margin-left: auto;
  > div span {
    color: ${props => props.theme['gray-3']};
  }
`
const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme['orange']} !important;
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
  const {
    // lockboxOpened,
    // lockboxDevices,
    supportedCoins
  } = rest
  const coinOrder = [
    supportedCoins.PAX,
    supportedCoins.BTC,
    supportedCoins.ETH,
    supportedCoins.BCH,
    supportedCoins.XLM
  ]
  // SwapOrTradeTest
  const { swapOrTrade } = rest

  return (
    <Wrapper {...rest}>
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <MenuIcon name='home' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.dashboard'
              defaultMessage='Dashboard'
            />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/buy-sell' activeClassName='active'>
        <MenuItem data-e2e='buyAndSellLink'>
          <MenuIcon name='cart-filled' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.buysell'
              defaultMessage='Buy & Sell'
              className='destination'
            />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/swap' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
          <MenuIcon name='thick-arrow-switch' size='24px' />
          {/* SwapOrTradeTest */}
          <Destination>
            {swapOrTrade !== 'trade' ? (
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.swap'
                defaultMessage='Swap'
              />
            ) : (
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.trade'
                defaultMessage='Trade'
              />
            )}
          </Destination>
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/lockbox' activeClassName='active'>
        <MenuItem data-e2e='lockboxLink'>
          <MenuIcon
            name='hardware'
            style={{ paddingLeft: '2px' }}
            size='24px'
          />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.hardware'
              defaultMessage='Hardware'
            />
          </Destination>
          <HelperTipContainer>
            <TooltipHost id='lockboxRequired'>
              <TooltipIcon color='blue' name='info' />
            </TooltipHost>
          </HelperTipContainer>
        </MenuItem>
      </LinkContainer>
      {/* TODO: bring back lockbox menu */}
      {/* lockboxOpened && (
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
      ) */}
      <Separator />
      {values(
        mapObjIndexed(
          (coin, i) =>
            coin.txListAppRoute &&
            coin.invited && (
              <LinkContainer
                key={i}
                to={coin.txListAppRoute}
                activeClassName='active'
              >
                <MenuItem
                  data-e2e={`${toLower(coin.coinCode)}Link`}
                  colorCode={coin.colorCode}
                  className='coin'
                >
                  <CoinIcon
                    color={coin.colorCode}
                    name={coin.icons.circleFilled}
                    size='24px'
                  />
                  <Destination>{coin.displayName}</Destination>
                  {coin.showNewTagSidenav && (
                    <NewCartridge>
                      <Text color='orange' size='12' weight={500} uppercase>
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
          coinOrder
        )
      )}
      <Separator />
      {props.isPitAccountLinked ? (
        <Link
          href={props.pitUrl}
          rel='noopener noreferrer'
          target='_blank'
          style={{ width: '100%' }}
        >
          <MenuItem data-e2e='thePitLink'>
            <MenuIcon
              name='the-pit'
              style={{ paddingLeft: '2px' }}
              size='24px'
            />
            <Destination>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.thepit'
                defaultMessage='The PIT'
              />
            </Destination>
          </MenuItem>
        </Link>
      ) : (
        <LinkContainer to='/thepit' activeClassName='active'>
          <MenuItem data-e2e='thePitLink'>
            <MenuIcon
              name='the-pit'
              style={{ paddingLeft: '2px' }}
              size='24px'
            />
            <Destination>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.thepit'
                defaultMessage='The PIT'
              />
            </Destination>
            <NewCartridge>
              <Text color='orange' size='12' weight={500} uppercase>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.transactions.new'
                  defaultMessage='New'
                />
              </Text>
            </NewCartridge>
          </MenuItem>
        </LinkContainer>
      )}
    </Wrapper>
  )
}

Navigation.propTypes = {
  lockboxOpened: PropTypes.bool
}

export default Navigation
