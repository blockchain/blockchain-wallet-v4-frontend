import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { NavbarNavItem, NavbarNavItemButton, NavbarNavItemIcon } from 'components/Navbar'
import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from 'components/Navbar/NavbarDropdown'
import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'

import { Props } from '.'

const DropdownSeparator = styled.div`
  height: 1px;
  width: 24px;
  margin-left: 16px;
  margin-bottom: 8px;
  background: ${(props) => props.theme.grey000};
`

const Settings = (props: Props) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  const handleMenuToggle = () => {
    toggleIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }

  return (
    <NavbarNavItem>
      <NavbarNavItemButton data-e2e='settingsLink' onClick={handleMenuToggle}>
        <NavbarNavItemIcon persist name='cog-filled' size='18px' />
        {isMenuOpen && (
          <DropdownMenu ref={ref}>
            <DropdownMenuArrow />
            <LinkContainer
              onClick={() => {
                props.settingsActions.generalSettingsInternalRedirect('General')
              }}
              to='/settings/general'
              activeClassName='active'
            >
              <DropdownMenuItem data-e2e='settings_generalLink'>
                <Destination>
                  <FormattedMessage id='layouts.wallet.header.general' defaultMessage='General' />
                </Destination>
              </DropdownMenuItem>
            </LinkContainer>
            <DropdownMenuItem
              data-e2e='settings_profileLink'
              onClick={() => {
                props.modalActions.showModal('TRADING_LIMITS_MODAL', {
                  origin: 'TradingLimits'
                })

                props.settingsActions.generalSettingsInternalRedirect('TradingLimits')
              }}
            >
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.header.tradinglimits'
                  defaultMessage='Trading Limits'
                />
              </Destination>
            </DropdownMenuItem>
            <LinkContainer
              onClick={() => {
                props.settingsActions.generalSettingsInternalRedirect('Preferences')
              }}
              to='/settings/preferences'
              activeClassName='active'
            >
              <DropdownMenuItem data-e2e='settings_preferencesLink'>
                <Destination>
                  <FormattedMessage
                    id='layouts.wallet.header.preferences'
                    defaultMessage='Preferences'
                  />
                </Destination>
              </DropdownMenuItem>
            </LinkContainer>
            <LinkContainer
              onClick={() => {
                props.settingsActions.generalSettingsInternalRedirect('WalletAndAddresses')
              }}
              to='/settings/addresses'
              activeClassName='active'
            >
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
            <DropdownMenuItem
              onClick={() => {
                props.sessionActions.logout()
              }}
              data-e2e='logoutLink'
            >
              <Destination>
                <FormattedMessage id='layouts.wallet.header.Sign Out' defaultMessage='Sign Out' />
              </Destination>
            </DropdownMenuItem>
          </DropdownMenu>
        )}
      </NavbarNavItemButton>
    </NavbarNavItem>
  )
}

export default Settings
