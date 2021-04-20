import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Cartridge } from '@blockchain-com/components'
import { map, toLower } from 'ramda'
import styled from 'styled-components'

import { Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { SupportedCoinType } from 'blockchain-wallet-v4/src/types'
import {
  CoinIcon,
  Destination,
  MenuIcon,
  MenuItem,
  Separator,
  Wrapper
} from 'layouts/Wallet/components'

import { Props } from '.'

const HelperTipContainer = styled.div`
  position: relative;
  > div span {
    color: ${props => props.theme['grey400']};
  }
`
const HelperTip = styled(TooltipHost)`
  position: absolute;
  left: 74px;
  top: -8px;
`
export const NewCartridge = styled(Cartridge)`
  color: ${props => props.theme.orange600} !important;
  background-color: ${props => props.theme.white};
  letter-spacing: 1px;
  margin-left: auto;
  margin-right: -4px;
  padding: 4px 4px;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 4px;
`
const PortfolioSeparator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 16px;
  margin-bottom: 4px;
  width: calc(100% - 16px);
  box-sizing: content-box;
`
const SeparatorWrapper = styled.div<{ margin?: string }>`
  width: calc(100% - 32px);
  margin: ${props => (props.margin ? props.margin : '8px 16px')};
  box-sizing: border-box;
`

type OwnProps = {
  exchangeUrl: string
}

const Divider = (props: { margin?: string }) => (
  <SeparatorWrapper {...props}>
    <Separator />
  </SeparatorWrapper>
)

const ExchangeNavItem = props => (
  <>
    <MenuIcon
      className='icon'
      name='blockchain-logo'
      style={{ marginLeft: '-2px' }}
      size='21px'
    />
    <Destination style={{ marginLeft: '2px' }}>
      <FormattedMessage
        id='layouts.wallet.menuleft.navigation.blockchain-exchange-1'
        defaultMessage='Exchange'
      />
    </Destination>
    {props.isExchangeAccountLinked && (
      <HelperTipContainer>
        <HelperTip id='exchangeSideNavConnected'>
          <TooltipIcon color='blue600' name='info' />
        </HelperTip>
      </HelperTipContainer>
    )}
  </>
)

const Navigation = (props: OwnProps & Props) => {
  const { coinList, lockboxDevices, ...rest } = props

  return (
    <Wrapper {...rest}>
      <Divider />
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <MenuIcon className='icon' name='home' size='24px' />
          <Destination>
            <FormattedMessage id='copy.home' defaultMessage='Home' />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/prices' activeClassName='active'>
        <MenuItem data-e2e='pricesLink'>
          <MenuIcon className='icon' name='compass' size='24px' />
          <Destination>
            <FormattedMessage id='copy.prices' defaultMessage='Prices' />
          </Destination>
        </MenuItem>
      </LinkContainer>
      {coinList.cata({
        Success: coinList =>
          coinList.length ? (
            <>
              <PortfolioSeparator>
                <Text
                  color='grey600'
                  lineHeight='20px'
                  weight={600}
                  size='14px'
                >
                  <FormattedMessage
                    id='copy.portfolio'
                    defaultMessage='Portfolio'
                  />
                </Text>
                <Divider />
              </PortfolioSeparator>
              {map(
                (coin: SupportedCoinType) => (
                  <LinkContainer
                    to={coin.txListAppRoute}
                    activeClassName='active'
                    key={coin.coinCode}
                  >
                    <MenuItem
                      data-e2e={`${toLower(coin.coinCode)}Link`}
                      colorCode={coin.coinCode}
                      className='coin'
                    >
                      <CoinIcon
                        className='coin-icon'
                        color={coin.coinCode}
                        name={coin.coinCode}
                        size='24px'
                      />
                      <Destination>{coin.displayName}</Destination>
                    </MenuItem>
                  </LinkContainer>
                ),
                coinList
              )}
            </>
          ) : null,
        Loading: () => null,
        NotAsked: () => null,
        Failure: () => null
      })}
      <Divider margin='0 16px 8px 16px' />
      <LinkContainer to='/airdrops' activeClassName='active'>
        <MenuItem data-e2e='airdropLink' className='airdrop'>
          <MenuIcon className='icon' name='parachute' size='24px' />
          <Destination>
            <FormattedMessage
              id='layouts.wallet.menuleft.navigation.airdrops'
              defaultMessage='Airdrops'
            />
          </Destination>
          {/* UNCOMMENT WHEN AIRDROPS ARE IN PROGRESS */}
          {/* <NewCartridge> */}
          {/*  <Text color='green600' size='12' weight={600} uppercase> */}
          {/*    <FormattedMessage */}
          {/*      id='layouts.wallet.menuleft.navigation.airdrop.active' */}
          {/*      defaultMessage='Active' */}
          {/*    /> */}
          {/*  </Text> */}
          {/* </NewCartridge> */}
        </MenuItem>
      </LinkContainer>
      <LinkContainer to='/exchange' activeClassName='active'>
        <MenuItem data-e2e='exchangeLink'>
          <ExchangeNavItem {...props} />
        </MenuItem>
      </LinkContainer>
      {lockboxDevices?.length > 0 ? (
        <LinkContainer to='/lockbox' activeClassName='active'>
          <MenuItem data-e2e='lockboxLink'>
            <MenuIcon
              className='icon'
              name='hardware'
              style={{ paddingLeft: '2px' }}
              size='24px'
            />
            <Destination style={{ marginLeft: '-2px' }}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.hardware'
                defaultMessage='Hardware'
              />
            </Destination>
            <HelperTipContainer>
              <HelperTip id='lockboxRequired'>
                <TooltipIcon color='blue600' name='info' />
              </HelperTip>
            </HelperTipContainer>
          </MenuItem>
        </LinkContainer>
      ) : null}
    </Wrapper>
  )
}

export default Navigation
