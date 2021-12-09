import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Icon, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import FabButton from 'components/FabButton'
import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from 'components/Navbar/NavbarDropdown'
import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'
import { media } from 'services/styles'

export type PrimaryNavItem = {
  dest: string
  e2e: string
  text: string | React.ReactNode
}

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
  border-bottom: 1px solid #f0f2f7;
  height: 56px;

  ${media.mobile`
    // handle mobile navbar
  `}
`

const Logo = styled.div`
  display: flex;
  align-items: center;

  & > a {
    height: 20px;
    width: 20px;
    color: #3d89f5;
    text-decoration: none;
  }
`

const NavLeft = styled.div`
  display: flex;
  align-items: stretch;
`

const NavRight = styled.div`
  display: flex;
  align-items: stretch;
`

const DropdownNavLink = styled(NavLink)`
  padding: 0 !important;
`

const ListStyles = styled.ul`
  list-style: none;
  display: flex;
  align-items: stretch;
  margin: 0;
  padding: 0 0 0 24px;

  & > li {
    display: flex;
    align-items: center;
    padding: 10px 12px;

    &:last-child {
      padding-right: 0;
    }

    &.rotate {
      transition-duration: 0.5s;
    }

    &.rotate:active {
      transform: rotate(360deg);
    }
  }

  & a {
    text-decoration: none;
    color: #677184;
    border-radius: 4px;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;

    &:hover,
    &.active {
      background-color: #ecf5fe;
      color: #0c6cf2;
    }
  }
`

const PrimaryNavItems = styled(ListStyles)`
  cursor: pointer;
`

const SecondaryNavItems = styled(ListStyles)`
  cursor: pointer;
`

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  background: transparent;
  min-width: auto;
  width: auto;
  padding: 0;
  border: 0;

  &:hover {
    background-color: transparent;
  }
`

const Navbar = ({
  fabClickHandler,
  limitsClickHandler,
  logoutClickHandler,
  mobileClickHandler,
  primaryNavItems,
  refreshClickHandler
}: Props) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  const handleMenuToggle = () => {
    toggleIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }
  return (
    <NavContainer>
      <NavLeft>
        <Logo>
          <NavLink to='/home' data-e2e='homeLink'>
            {
              // @ts-ignore
              <Icon name='blockchain' color='#3D89F5' size='md' />
            }
          </NavLink>
        </Logo>
        <PrimaryNavItems>
          {primaryNavItems.map((item: PrimaryNavItem) => (
            <li key={item.e2e}>
              <NavLink to={item.dest} data-e2e={item.e2e}>
                <Text variant='paragraph-1'>{item.text}</Text>
              </NavLink>
            </li>
          ))}
        </PrimaryNavItems>
      </NavLeft>
      <NavRight>
        <SecondaryNavItems>
          <li>
            <FabButton onClick={fabClickHandler} />
          </li>
          <li>
            <NavButton onClick={mobileClickHandler} data-e2e='mobileQRLink'>
              {
                // @ts-ignore
                <Icon color='#98A1B2' name='phone' size='sm' />
              }
            </NavButton>
          </li>
          <li className='rotate'>
            <NavButton onClick={refreshClickHandler} data-e2e='refreshLink'>
              {
                // @ts-ignore
                <Icon color='#98A1B2' name='refresh' size='sm' />
              }
            </NavButton>
          </li>
          <li>
            <NavButton onClick={handleMenuToggle} data-e2e='settingsLink'>
              {
                // @ts-ignore
                <Icon color='#98A1B2' name='user' size='sm' />
              }
              {isMenuOpen && (
                <DropdownMenu ref={ref}>
                  <DropdownMenuArrow />
                  <DropdownNavLink to='/settings/general'>
                    <DropdownMenuItem data-e2e='settings_generalLink'>
                      <Destination>
                        <FormattedMessage
                          id='layouts.wallet.header.general'
                          defaultMessage='General'
                        />
                      </Destination>
                    </DropdownMenuItem>
                  </DropdownNavLink>
                  <DropdownMenuItem data-e2e='settings_profileLink' onClick={limitsClickHandler}>
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.tradinglimits'
                        defaultMessage='Trading Limits'
                      />
                    </Destination>
                  </DropdownMenuItem>
                  <DropdownNavLink to='/settings/preferences'>
                    <DropdownMenuItem data-e2e='settings_preferencesLink'>
                      <Destination>
                        <FormattedMessage
                          id='layouts.wallet.header.preferences'
                          defaultMessage='Preferences'
                        />
                      </Destination>
                    </DropdownMenuItem>
                  </DropdownNavLink>
                  <DropdownNavLink to='/settings/addresses'>
                    <DropdownMenuItem data-e2e='settings_walletsLink'>
                      <Destination>
                        <FormattedMessage
                          id='layouts.wallet.header.walletsaddresses'
                          defaultMessage='Wallets & Addresses'
                        />
                      </Destination>
                    </DropdownMenuItem>
                  </DropdownNavLink>
                  <DropdownMenuItem onClick={logoutClickHandler} data-e2e='logoutLink'>
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.Sign Out'
                        defaultMessage='Sign Out'
                      />
                    </Destination>
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </NavButton>
          </li>
        </SecondaryNavItems>
      </NavRight>
    </NavContainer>
  )
}

type Props = {
  fabClickHandler: () => void
  limitsClickHandler: () => void
  logoutClickHandler: () => void
  mobileClickHandler: () => void
  primaryNavItems: Array<PrimaryNavItem>
  refreshClickHandler: () => void
}

export default Navbar
