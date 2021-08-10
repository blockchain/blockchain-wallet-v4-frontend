import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Cartridge } from '@blockchain-com/components'
import styled from 'styled-components'

import { TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { Destination, MenuIcon, MenuItem, Separator, Wrapper } from 'layouts/Wallet/components'

import { Props } from '.'
import Loading from './CoinList/template.loading'
import Success from './CoinList/template.success'

const HelperTipContainer = styled.div`
  position: relative;
  > div span {
    color: ${(props) => props.theme.grey400};
  }
`
const HelperTip = styled(TooltipHost)`
  position: absolute;
  left: 74px;
  top: -8px;
`
const SeparatorWrapper = styled.div<{ margin?: string }>`
  width: calc(100% - 32px);
  margin: ${(props) => (props.margin ? props.margin : '8px 16px')};
  box-sizing: border-box;
`
export const NewCartridge = styled(Cartridge)`
  color: ${(props) => props.theme.orange600} !important;
  background-color: ${(props) => props.theme.white};
  letter-spacing: 1px;
  margin-left: auto;
  margin-right: -4px;
  padding: 4px 4px;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 4px;
`
export const Divider = (props: { margin?: string }) => (
  <SeparatorWrapper {...props}>
    <Separator />
  </SeparatorWrapper>
)

type OwnProps = {
  exchangeUrl: string
}

const ExchangeNavItem = (props) => (
  <>
    <MenuIcon className='icon' name='blockchain-logo' style={{ marginLeft: '-2px' }} size='21px' />
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
  const { coinList, hasDeprecatedLockbox, ...rest } = props

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
        Failure: () => null,
        Loading: () => <Loading />,
        NotAsked: () => <Loading />,
        Success: (coinList) => <Success coinList={coinList} />
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
      {hasDeprecatedLockbox ? (
        <LinkContainer to='/lockbox' activeClassName='active'>
          <MenuItem data-e2e='lockboxLink'>
            <MenuIcon className='icon' name='hardware' style={{ paddingLeft: '2px' }} size='24px' />
            <Destination style={{ marginLeft: '-2px' }}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.hardware'
                defaultMessage='Hardware'
              />
            </Destination>
          </MenuItem>
        </LinkContainer>
      ) : null}
    </Wrapper>
  )
}

export default Navigation
