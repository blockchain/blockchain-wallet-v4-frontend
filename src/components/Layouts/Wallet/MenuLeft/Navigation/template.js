import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink as Link } from 'react-router-dom'
import styled from 'styled-components'

let Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

let NavList = styled.ul`
  list-style: none;
  padding: 0;
`

let SubNavList = styled.ul`
  list-style: none;
  font-size: 1em;
  text-transform: none;
  padding-left: 38px;
  margin-top: 0.3125em;
`

let NavHeader = styled.li`
  font-size: 13px;
  font-weight: 400;
  margin: 0 0 10px 0;
  position: relative;
  text-transform: uppercase;
`

let SubNavHeader = NavHeader.extend`
  padding: 0.3125em;
  text-transform: none;
  margin: 0px;
`

let NavIcon = styled.i`
  font-size: 20px;
  margin-right: .55em;
  text-align: center;
  line-height: 0;
  width: 20px;
`

let NavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${props => props.theme.basicGrey};
  padding: .4em .8em;

  &.active {
    color: ${props => props.theme.iris};
  }
`

let SubNavLink = NavLink.extend`
  padding: 0px;
`

const Navigation = (props) => (
  <Wrapper>
    <NavList>
      <NavHeader>
        <NavLink to='/wallet' activeClassName='active' onClick={props.clickOthers}>
          <NavIcon className='icon-home' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
        </NavLink>
      </NavHeader>
      <NavHeader>
        <NavLink to='/transactions' activeClassName='active' onClick={props.clickOthers}>
          <NavIcon className='icon-tx' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' />
        </NavLink>
      </NavHeader>
      <NavHeader>
        <NavLink to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
          <NavIcon className='icon-bitcoin' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy bitcoin' />
        </NavLink>
      </NavHeader>
      <NavHeader>
        <NavLink to='/security-center' activeClassName='active' onClick={props.clickOthers}>
          <NavIcon className='icon-lock' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' />
        </NavLink>
      </NavHeader>
      <NavHeader>
        <NavLink to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
          <NavIcon className='icon-settings' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' />
        </NavLink>
        {props.securityCenterMenuDisplayed && (
          <SubNavList>
            <SubNavHeader>
              <SubNavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/info' activeClassName='active'>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' />
              </SubNavLink>
            </SubNavHeader>
            <SubNavHeader>
              <SubNavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/preferences' activeClassName='active'>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' />
              </SubNavLink>
            </SubNavHeader>
            <SubNavHeader>
              <SubNavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/security' activeClassName='active'>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.security' defaultMessage='Security' />
              </SubNavLink>
            </SubNavHeader>
            <SubNavHeader>
              <SubNavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/addresses' activeClassName='active'>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' />
              </SubNavLink>
            </SubNavHeader>
          </SubNavList>
        )}
      </NavHeader>
      <NavHeader>
        <NavLink to='/faq' activeClassName='active' onClick={props.clickOthers}>
          <NavIcon className='icon-help' />
          <FormattedMessage id='components.layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' />
        </NavLink>
      </NavHeader>
    </NavList>
  </Wrapper>
)

export default Navigation
