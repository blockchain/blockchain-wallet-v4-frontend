import React from 'react'
import styled from 'styled-components'

import { RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const NavList = styled.ul`
  list-style: none;
  padding: 0;
`
const SubNavList = styled.ul`
  list-style: none;
  font-size: 1em;
  text-transform: none;
  padding-left: 38px;
  margin-top: 0.3125em;
`
const NavHeader = styled.li`
  font-size: 13px;
  font-weight: 400;
  margin: 0 0 10px 0;
  position: relative;
  text-transform: uppercase;

  display: flex;
  align-items: center;
  color: ${props => props.theme.basicGrey};
  padding: .4em .8em;

  &.active {
    color: ${props => props.theme.iris};
  }
`
const SubNavHeader = NavHeader.extend`
  padding: 0.3125em;
  text-transform: none;
  margin: 0px;
`
const NavIcon = styled.i`
  font-size: 20px;
  margin-right: .55em;
  text-align: center;
  line-height: 0;
  width: 20px;
`

const Navigation = (props) => (
  <Wrapper>
    <NavList>
      <RouterLink to='/wallet' activeClassName='active' onClick={props.clickOthers}>
        <NavHeader>
          <NavIcon className='icon-home' />
          <Text id='components.layouts.wallet.menuleft.navigation.home' text='Home' />
        </NavHeader>
      </RouterLink>
      <RouterLink to='/transactions' activeClassName='active' onClick={props.clickOthers}>
        <NavHeader>
          <NavIcon className='icon-tx' />
          <Text id='components.layouts.wallet.menuleft.navigation.transactions' text='Transactions' />
        </NavHeader>
      </RouterLink>
      <RouterLink to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
        <NavHeader>
          <NavIcon className='icon-bitcoin' />
          <Text id='components.layouts.wallet.menuleft.navigation.buybitcoin' text='Buy bitcoin' />
        </NavHeader>
      </RouterLink>
      <RouterLink to='/security-center' activeClassName='active' onClick={props.clickOthers}>
        <NavHeader>
          <NavIcon className='icon-lock' />
          <Text id='components.layouts.wallet.menuleft.navigation.securitycenter' text='Security center' />
        </NavHeader>
      </RouterLink>
      <RouterLink to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
        <NavHeader>
          <NavIcon className='icon-settings' />
          <Text id='components.layouts.wallet.menuleft.navigation.settings' text='Settings' />
        </NavHeader>
      </RouterLink>
      {props.securityCenterMenuDisplayed && (
        <SubNavList>
          <SubNavHeader>
            <RouterLink to='/settings/info' activeClassName='active'>
              <Text id='components.layouts.wallet.menuleft.navigation.walletinfo' text='Wallet information' />
            </RouterLink>
          </SubNavHeader>
          <SubNavHeader>
            <RouterLink to='/settings/preferences' activeClassName='active'>
              <Text id='components.layouts.wallet.menuleft.navigation.preferences' text='Preferences' />
            </RouterLink>
          </SubNavHeader>
          <SubNavHeader>
            <RouterLink to='/settings/security' activeClassName='active'>
              <Text id='components.layouts.wallet.menuleft.navigation.security' text='Security' />
            </RouterLink>
          </SubNavHeader>
          <SubNavHeader>
            <RouterLink to='/settings/addresses' activeClassName='active'>
              <Text id='components.layouts.wallet.menuleft.navigation.addresses' text='Addresses' />
            </RouterLink>
          </SubNavHeader>
        </SubNavList>
      )}
      <RouterLink to='/faq' activeClassName='active' onClick={props.clickOthers}>
        <NavHeader>
          <NavIcon className='icon-help' />
          <Text id='components.layouts.wallet.menuleft.navigation.faq' text='Faq' />
        </NavHeader>
      </RouterLink>
    </NavList>
  </Wrapper>
)

export default Navigation
