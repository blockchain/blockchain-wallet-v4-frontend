import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { RouterLink, Text } from 'blockchain-components'

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
  text-transform: none;
  padding-left: 38px;
  margin-top: 0.3125em;
`
const NavHeader = styled.li`
  margin: 0 0 10px 0;
  position: relative;
  display: flex;
  align-items: center;
  color: ${props => props.theme.basicGrey};
  padding: 0.4em 0.8em;

  &.active {
    & > * {
      color: ${props => props.theme.iris};
    }
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

const Navigation = (props) => {
  const { settingsToggled, handleOpenSettings, handleCloseSettings, handleCloseMenuLeft, ...rest } = props

  return (
    <Wrapper {...rest}>
      <NavList>
        <RouterLink to='/wallet' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <NavIcon className='icon-home' />
            <Text id='components.layouts.wallet.menuleft.navigation.home' text='Home' smaller uppercase />
          </NavHeader>
        </RouterLink>
        <RouterLink to='/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <NavIcon className='icon-tx' />
            <Text id='components.layouts.wallet.menuleft.navigation.transactions' text='Transactions' smaller uppercase />
          </NavHeader>
        </RouterLink>
        <RouterLink to='/buy-sell' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <NavIcon className='icon-bitcoin' />
            <Text id='components.layouts.wallet.menuleft.navigation.buybitcoin' text='Buy bitcoin' smaller uppercase />
          </NavHeader>
        </RouterLink>
        <RouterLink to='/security-center' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <NavIcon className='icon-lock' />
            <Text id='components.layouts.wallet.menuleft.navigation.securitycenter' text='Security center' smaller uppercase />
          </NavHeader>
        </RouterLink>
        <RouterLink to='/settings' activeClassName='active' onClick={handleOpenSettings}>
          <NavHeader>
            <NavIcon className='icon-settings' />
            <Text id='components.layouts.wallet.menuleft.navigation.settings' text='Settings' smaller uppercase />
          </NavHeader>
        </RouterLink>
        {settingsToggled && (
          <SubNavList>
            <RouterLink to='/settings/info' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <Text id='components.layouts.wallet.menuleft.navigation.walletinfo' text='Wallet information' smaller />
              </SubNavHeader>
            </RouterLink>
            <RouterLink to='/settings/preferences' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <Text id='components.layouts.wallet.menuleft.navigation.preferences' text='Preferences' smaller />
              </SubNavHeader>
            </RouterLink>
            <RouterLink to='/settings/security' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <Text id='components.layouts.wallet.menuleft.navigation.security' text='Security' smaller />
              </SubNavHeader>
            </RouterLink>
            <RouterLink to='/settings/addresses' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <Text id='components.layouts.wallet.menuleft.navigation.addresses' text='Addresses' smaller />
              </SubNavHeader>
            </RouterLink>
          </SubNavList>
        )}
        <RouterLink to='/faq' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <NavIcon className='icon-help' />
            <Text id='components.layouts.wallet.menuleft.navigation.faq' text='Faq' smaller uppercase />
          </NavHeader>
        </RouterLink>
      </NavList>
    </Wrapper>
  )
}

Navigation.propTypes = {
  settingsToggled: PropTypes.bool.isRequired,
  handleOpenSettings: PropTypes.func.isRequired,
  handleCloseSettings: PropTypes.func.isRequired,
  handleCloseMenuLeft: PropTypes.func.isRequired
}

export default Navigation
