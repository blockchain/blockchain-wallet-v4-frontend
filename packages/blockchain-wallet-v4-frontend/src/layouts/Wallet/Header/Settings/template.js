import { Destination } from 'components/MenuLeft'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuItem
} from 'components/Navbar/NavbarDropdown'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  NavbarNavItemTextHeader,
  NavbarNavItemTextIcon,
  NavbarNavItemTextLink
} from 'components/Navbar'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

const DropdownSeparator = styled.div`
  height: 1px;
  width: 24px;
  margin-left: 16px;
  margin-bottom: 8px;
  background: ${props => props.theme.grey000};
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
