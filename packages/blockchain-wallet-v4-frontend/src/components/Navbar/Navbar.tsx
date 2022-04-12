import React, { useCallback, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { colors, Icon, Text } from '@blockchain-com/constellation'
import { IconClose, IconMenu, IconRefresh, IconUser } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Button, Image } from 'blockchain-info-components'
import FabButton from 'components/FabButton'
import { MobileNav } from 'components/Navbar'
import { Destination } from 'layouts/Wallet/components'
import { NewCartridge } from 'layouts/Wallet/MenuLeft/Navigation/template'
import { useOnClickOutside } from 'services/misc'
import { useMedia } from 'services/styles'

import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from './Dropdown'
import MobileDropdown from './MobileDropdown'

export type PrimaryNavItem = {
  dest: string
  e2e: string
  text: string | React.ReactNode
}

const NavContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.white100};
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
  border-bottom: 1px solid ${colors.grey100};
  height: 56px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;

  & > a {
    height: 20px;
    width: 20px;
    color: ${colors.blue500};
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

    &.refresh {
      transition-duration: 0.5s;
    }

    &.refresh:active {
      transform: rotate(360deg);
    }
  }

  & a {
    text-decoration: none;
    color: ${colors.grey600};
    border-radius: 4px;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;

    &:hover,
    &.active {
      background-color: ${colors.blue000};
      color: ${colors.blue600};
    }
  }
`

const PrimaryNavItems = styled(ListStyles)`
  cursor: pointer;

  & > li {
    padding: 10px 8px;

    & > a > span {
      font-weight: 600;
    }
  }
`

const StyledButton = styled(Button)`
  padding: 0 12px;
  min-width: 32px;
  border-radius: 4px;
`

const SecondaryNavItems = styled(ListStyles)`
  cursor: pointer;

  & > li:nth-child(-n + 2) {
    padding: 0;
  }

  & > li:nth-child(2) {
    padding-left: 8px;
  }

  & > li:nth-child(3) {
    padding-left: 8px;
  }
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

const UpperNewCartridge = styled(NewCartridge)`
  text-transform: uppercase;
  margin-left: 2.5rem;
`

const Navbar = ({
  fabClickHandler,
  limitsClickHandler,
  logoutClickHandler,
  primaryNavItems,
  receiveClickHandler,
  refreshClickHandler,
  sendClickHandler,
  taxCenterClickHandler,
  taxCenterEnabled,
  trackEventCallback
}: Props) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))
  const [isMobileNavOpen, setMobileNav] = useState(false)
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')

  const handleMenuToggle = () => {
    toggleIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }

  const closeMobileNavOpenSendCallback = useCallback(() => {
    setMobileNav(false)
    sendClickHandler()
  }, [])

  const closeMobileNavOpenReceiveCallback = useCallback(() => {
    setMobileNav(false)
    receiveClickHandler()
  }, [])

  const closeMobileNavOpenTradeCallback = useCallback(() => {
    setMobileNav(false)
    fabClickHandler()
  }, [])

  const closeMobileNavCallback = useCallback(() => {
    setMobileNav(false)
  }, [])
  const openMobileNavCallback = useCallback(() => {
    setMobileNav(true)
  }, [])

  const tertiaryNavItems = [
    {
      clickHandler: () => {
        trackEventCallback('General')
      },
      copy: <FormattedMessage id='navbar.settings.general' defaultMessage='General' />,
      'data-e2e': 'settings_generalLink',
      to: '/settings/general'
    },
    {
      copy: <FormattedMessage id='buttons.security' defaultMessage='Security' />,
      'data-e2e': 'securityCenterLink',
      to: '/security-center'
    },
    {
      clickHandler: limitsClickHandler,
      copy: (
        <FormattedMessage
          id='layouts.wallet.header.tradinglimits'
          defaultMessage='Trading Limits'
        />
      ),
      'data-e2e': 'settings_profileLink'
    },
    {
      clickHandler: () => {
        trackEventCallback('Preferences')
      },
      copy: (
        <FormattedMessage id='layouts.wallet.header.preferences' defaultMessage='Preferences' />
      ),
      'data-e2e': 'settings_preferencesLink',
      to: '/settings/preferences'
    },
    {
      clickHandler: () => {
        trackEventCallback('Preferences')
      },
      copy: (
        <FormattedMessage
          id='layouts.wallet.header.walletsaddresses'
          defaultMessage='Wallets & Addresses'
        />
      ),
      'data-e2e': 'settings_walletsLink',
      to: '/settings/addresses'
    },
    {
      clickHandler: logoutClickHandler,
      copy: <FormattedMessage id='layouts.wallet.header.Sign Out' defaultMessage='Sign Out' />,
      'data-e2e': 'logoutLink'
    }
  ]

  if (taxCenterEnabled) {
    tertiaryNavItems.splice(0, 0, {
      clickHandler: taxCenterClickHandler,
      copy: (
        <>
          <FormattedMessage id='navbar.tax' defaultMessage='Tax Center' />
          <UpperNewCartridge>
            <FormattedMessage id='buttons.new' defaultMessage='new' />
          </UpperNewCartridge>
        </>
      ),
      'data-e2e': 'tax_CenterLink'
    })
  }

  const secondaryNavItems = [
    {
      component: () => (
        <StyledButton
          data-e2e='sendButton'
          nature='empty-blue'
          onClick={closeMobileNavOpenSendCallback}
          small
        >
          <FormattedMessage id='buttons.send' defaultMessage='Send' />
        </StyledButton>
      ),
      name: 'Send'
    },
    {
      component: () => (
        <StyledButton
          data-e2e='receiveButton'
          nature='empty-blue'
          onClick={closeMobileNavOpenReceiveCallback}
          small
        >
          <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
        </StyledButton>
      ),
      name: 'Receive'
    },
    {
      clickHandler: closeMobileNavOpenTradeCallback,
      component: () => <FabButton onClick={closeMobileNavOpenTradeCallback} />,
      name: 'Trade'
    },
    {
      component: () => <MobileDropdown />,
      name: 'mobile-app'
    },
    {
      component: () => (
        <NavButton onClick={refreshClickHandler} data-e2e='refreshLink'>
          <Icon label='refresh' size='sm' color='grey400'>
            <IconRefresh />
          </Icon>
        </NavButton>
      ),
      name: 'Refresh'
    },
    {
      component: () => (
        <NavButton onClick={handleMenuToggle} data-e2e='settingsLink'>
          <Icon label='user' size='sm' color='grey400'>
            <IconUser />
          </Icon>
          {isMenuOpen && (
            <DropdownMenu ref={ref}>
              <DropdownMenuArrow />
              {tertiaryNavItems.map(({ clickHandler = () => {}, copy, 'data-e2e': e2e, to }) => {
                if (!to && clickHandler) {
                  return (
                    <DropdownMenuItem key={e2e} onClick={clickHandler} data-e2e={e2e}>
                      <Destination>{copy}</Destination>
                    </DropdownMenuItem>
                  )
                }
                return (
                  <DropdownNavLink key={e2e} to={to}>
                    <DropdownMenuItem data-e2e={e2e} onClick={clickHandler}>
                      <Destination>{copy}</Destination>
                    </DropdownMenuItem>
                  </DropdownNavLink>
                )
              })}
            </DropdownMenu>
          )}
        </NavButton>
      ),
      name: 'Settings'
    }
  ]
  const secondaryMobileNavItems = secondaryNavItems.filter(
    ({ name }) => name !== 'Mobile App' && name !== 'Refresh' && name !== 'Settings'
  )

  // @ts-ignore
  return (
    <NavContainer>
      {isMobileNavOpen && (
        <MobileNav
          handleClose={closeMobileNavCallback}
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryMobileNavItems}
          tertiaryNavItems={tertiaryNavItems}
        />
      )}
      <NavLeft>
        <Logo onClick={closeMobileNavCallback}>
          <NavLink to='/home' data-e2e='homeLink'>
            <Image width='25px' name='blockchain-icon' />
          </NavLink>
        </Logo>
        {!isMobile && !isTablet && (
          <PrimaryNavItems>
            {primaryNavItems.map((item: PrimaryNavItem) => (
              <li key={item.e2e}>
                <NavLink to={item.dest} data-e2e={item.e2e}>
                  <Text variant='paragraph-1'>{item.text}</Text>
                </NavLink>
              </li>
            ))}
          </PrimaryNavItems>
        )}
      </NavLeft>
      <NavRight>
        <SecondaryNavItems>
          {isMobile || isTablet ? (
            <>
              <li>
                <StyledButton
                  data-e2e='sendButton'
                  nature='empty-blue'
                  onClick={closeMobileNavOpenSendCallback}
                  small
                >
                  <FormattedMessage id='buttons.send' defaultMessage='Send' />
                </StyledButton>
              </li>
              <li>
                <StyledButton
                  data-e2e='receiveButton'
                  nature='empty-blue'
                  onClick={closeMobileNavOpenReceiveCallback}
                  small
                >
                  <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
                </StyledButton>
              </li>
              <li>
                <FabButton onClick={closeMobileNavOpenTradeCallback} />
              </li>
              <li>
                {isMobileNavOpen ? (
                  <Icon
                    color='grey600'
                    data-e2e='closeMobileNav'
                    label='close'
                    // @ts-ignore
                    role='button'
                    size='md'
                    onClick={closeMobileNavCallback}
                  >
                    <IconClose />
                  </Icon>
                ) : (
                  <NavButton onClick={openMobileNavCallback} data-e2e='mobileNavExpand'>
                    <Icon label='menu' size='md' color='blue500'>
                      <IconMenu />
                    </Icon>
                  </NavButton>
                )}
              </li>
            </>
          ) : (
            <>
              {secondaryNavItems.map((item) => (
                <li key={item.name} className={item.name === 'Refresh' ? 'refresh' : ''}>
                  {item.component()}
                </li>
              ))}
            </>
          )}
        </SecondaryNavItems>
      </NavRight>
    </NavContainer>
  )
}

type Props = {
  fabClickHandler: () => void
  limitsClickHandler: () => void
  logoutClickHandler: () => void
  primaryNavItems: Array<PrimaryNavItem>
  receiveClickHandler: () => void
  refreshClickHandler: () => void
  sendClickHandler: () => void
  taxCenterClickHandler: () => void
  taxCenterEnabled: boolean
  trackEventCallback: (eventName: string) => void
}

export default Navbar
