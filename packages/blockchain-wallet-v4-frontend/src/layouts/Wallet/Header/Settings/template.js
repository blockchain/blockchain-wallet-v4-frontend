import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'

import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { triangle } from 'polished'

import {
  NavbarNavItemTextLink,
  NavbarNavItemTextHeader,
  NavbarNavItemTextIcon
} from 'components/Navbar'
import { Destination, MenuItem } from 'components/MenuLeft'
import media from 'services/ResponsiveService'

const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 3;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.theme['white']};
  box-shadow: 0px 0px 16px rgba(18, 29, 51, 0.25);
`
const DropdownMenuItem = styled(MenuItem)`
  white-space: nowrap;
  padding: 8px 16px;
  margin-bottom: 0;
`
const DropdownMenuArrow = styled.div`
  position: absolute;
  top: -8px;
  right: 64px;
  ${props => {
    return triangle({
      pointingDirection: 'top',
      width: '16px',
      height: '8px',
      foregroundColor: props.theme['white']
    })
  }}
  ${media.tablet`
    right: 8px;
  `}
`
const DropdownSeparator = styled.div`
  height: 1px;
  width: 24px;
  margin-left: 16px;
  margin-bottom: 8px;
  background: ${props => props.theme['gray-1']};
`

const Settings = props => {
  const { handleLogout } = props
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)

  Settings.handleClickOutside = () => toggleIsMenuOpen(false)

  return (
    <NavbarNavItemTextLink
      data-e2e='settingsLink'
      className={isMenuOpen && 'active'}
      onClick={() => toggleIsMenuOpen(!isMenuOpen)}
    >
      <NavbarNavItemTextIcon
        className='icon'
        name='cog-filled'
        size='18px'
        color='white'
      />
      <NavbarNavItemTextHeader
        size='14px'
        weight={600}
        color='white'
        className='settings'
      >
        <FormattedMessage
          id='layouts.wallet.header.settings'
          defaultMessage='Settings'
        />
      </NavbarNavItemTextHeader>
      {isMenuOpen && (
        <DropdownMenu>
          <DropdownMenuArrow />
          <LinkContainer to='/settings/general' activeClassName='active'>
            <DropdownMenuItem data-e2e='settings_generalLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.general'
                  defaultMessage='General'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/profile' activeClassName='active'>
            <DropdownMenuItem data-e2e='settings_profileLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.profile'
                  defaultMessage='Profile'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/preferences' activeClassName='active'>
            <DropdownMenuItem data-e2e='settings_preferencesLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.preferences'
                  defaultMessage='Preferences'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/settings/addresses' activeClassName='active'>
            <DropdownMenuItem data-e2e='settings_walletsLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.walletsaddresses'
                  defaultMessage='Wallets & Addresses'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <DropdownSeparator />
          <DropdownMenuItem onClick={handleLogout} data-e2e='logoutLink'>
            <Destination>
              <FormattedMessage
                id='layouts.wallet.header.Sign Out'
                defaultMessage='Sign Out'
              />
            </Destination>
          </DropdownMenuItem>
        </DropdownMenu>
      )}
    </NavbarNavItemTextLink>
  )
}

const clickOutsideConfig = {
  handleClickOutside: () => Settings.handleClickOutside
}

Settings.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default onClickOutside(Settings, clickOutsideConfig)
