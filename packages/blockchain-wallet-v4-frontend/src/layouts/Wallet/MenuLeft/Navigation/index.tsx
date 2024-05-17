import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import SuperAppLink from 'components/Navbar/SuperAppLink'
import { isKycVerificationEnabled } from 'data/custodial/selectors'
import { authAndRouteToExchangeAction } from 'data/modules/profile/actions'
import { ExchangeAuthOriginType } from 'data/types'
import { Destination, MenuIcon, MenuItem, Separator, Wrapper } from 'layouts/Wallet/components'

import CoinList from './CoinList'

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
  margin: ${(props) => (props.margin ? props.margin : '8px 16px')};
  box-sizing: border-box;
`
const ExchangeNav = styled.div`
  display: flex;
  justify-content: flex-start;
`
const ExchangeMenuItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Divider = ({ margin }: { margin?: string }) => (
  <SeparatorWrapper margin={margin}>
    <Separator />
  </SeparatorWrapper>
)

const ExchangeNavItem = () => {
  return (
    <>
      <ExchangeNav>
        <MenuIcon
          className='icon'
          name='blockchain-logo'
          style={{ marginLeft: '-2px' }}
          size='21px'
        />
        <Destination style={{ marginLeft: '2px' }}>
          <FormattedMessage id='copy.exchange' defaultMessage='Exchange' />
        </Destination>
      </ExchangeNav>
      <Icon name='open-in-new-tab' color='grey600' cursor size='16px' />
    </>
  )
}

const Navigation = () => {
  const dispatch = useDispatch()

  const kycVerificationEnabled = useSelector(isKycVerificationEnabled)

  return (
    <Wrapper>
      <SuperAppLink />
      <Divider />
      <LinkContainer to='/home' activeClassName='active'>
        <MenuItem data-e2e='dashboardLink'>
          <MenuIcon className='icon' name='home' size='24px' />
          <Destination>
            <FormattedMessage id='copy.home' defaultMessage='Home' />
          </Destination>
        </MenuItem>
      </LinkContainer>
      <PortfolioSeparator>
        <Text color='grey600' lineHeight='20px' weight={600} size='14px'>
          <FormattedMessage id='copy.portfolio' defaultMessage='Portfolio' />
        </Text>
        <Divider />
      </PortfolioSeparator>
      <CoinList />
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
        </MenuItem>
      </LinkContainer>
      {kycVerificationEnabled && (
        <ExchangeMenuItem
          data-e2e='exchangeLink'
          onClick={() => dispatch(authAndRouteToExchangeAction(ExchangeAuthOriginType.SideMenu))}
        >
          <ExchangeNavItem />
        </ExchangeMenuItem>
      )}
    </Wrapper>
  )
}

export default Navigation
