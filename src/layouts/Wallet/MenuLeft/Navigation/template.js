import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Icon } from 'blockchain-info-components'

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
  justify-content: start;
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
// const NavIcon = styled(Icon)`
//   font-size: 20px;
//   margin-right: .55em;
//   text-align: center;
//   line-height: 0;
//   width: 20px;
// `

const Navigation = (props) => {
  const { settingsToggled, handleOpenSettings, handleCloseSettings, handleCloseMenuLeft, ...rest } = props

  return (
    <Wrapper {...rest}>
      <NavList>
        <LinkContainer to='/wallet' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <Icon name='home' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
          </NavHeader>
        </LinkContainer>
        <LinkContainer to='/transactions' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <Icon name='tx' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' smaller uppercase />
          </NavHeader>
        </LinkContainer>
        <LinkContainer to='/buy-sell' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <Icon name='bitcoin' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy bitcoin' smaller uppercase />
          </NavHeader>
        </LinkContainer>
        <LinkContainer to='/security-center' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <Icon name='lock' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' smaller uppercase />
          </NavHeader>
        </LinkContainer>
        <LinkContainer to='/settings' activeClassName='active' onClick={handleOpenSettings}>
          <NavHeader>
            <Icon name='settings' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' smaller uppercase />
          </NavHeader>
        </LinkContainer>
        {settingsToggled && (
          <SubNavList>
            <LinkContainer to='/settings/info' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' smaller />
              </SubNavHeader>
            </LinkContainer>
            <LinkContainer to='/settings/preferences' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' smaller />
              </SubNavHeader>
            </LinkContainer>
            <LinkContainer to='/settings/security' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.security' defaultMessage='Security' smaller />
              </SubNavHeader>
            </LinkContainer>
            <LinkContainer to='/settings/addresses' activeClassName='active' onClick={handleCloseMenuLeft}>
              <SubNavHeader>
                <FormattedMessage id='components.layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' smaller />
              </SubNavHeader>
            </LinkContainer>
          </SubNavList>
        )}
        <LinkContainer to='/faq' activeClassName='active' onClick={handleCloseSettings}>
          <NavHeader>
            <Icon name='help' />
            <FormattedMessage id='components.layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' smaller uppercase />
          </NavHeader>
        </LinkContainer>
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
