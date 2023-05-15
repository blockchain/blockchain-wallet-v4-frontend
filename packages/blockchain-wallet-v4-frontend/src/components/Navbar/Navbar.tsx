import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import {
  Flex,
  IconClose,
  IconMenu,
  IconRefresh,
  Padding,
  PaletteColors,
  Text
} from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Image } from 'blockchain-info-components'
import { RoundedBadge } from 'components/Badge'
import FabButton from 'components/FabButton'
import { media, useMedia } from 'services/styles'

import MobileDropdown from './MobileDropdown'
import MobileNav from './MobileNav'
import UserNavDropdown, { userNavItems } from './UserNavDropdown'

export type PrimaryNavItem = {
  dest: string
  e2e: string
  isNew?: boolean
  text: string | React.ReactNode
}

export const NavContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: ${PaletteColors['white-100']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 22px;
  border-bottom: 1px solid ${PaletteColors['grey-000']};
  height: 56px;
  ${media.tablet`
    padding: 0 12px;
  `}
`

export const Logo = styled.div`
  display: flex;
  align-items: center;

  & > a {
    height: 25px;
    width: 25px;
    color: ${PaletteColors['blue-500']};
    text-decoration: none;
  }
`

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
`

export const NavRight = styled.div`
  display: flex;
  align-items: center;
`

export const DropdownNavLink = styled(NavLink)`
  padding: 0 !important;
  text-decoration: none;
`

const ListStyles = styled.ul`
  list-style: none;
  display: flex;
  align-items: stretch;
  margin: 0;
  padding: 0 0 0 24px;
  ${media.tabletL`
    padding: 0 0 0 6px;
  `}

  & > li {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    ${media.tabletL`
      padding: 10px 6px;
    `}

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
    color: ${PaletteColors['grey-600']};
    border-radius: 4px;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;

    &:hover,
    &.active {
      background-color: ${PaletteColors['blue-000']};
      color: ${PaletteColors['blue-600']};
    }
  }
`

const PrimaryNavItems = styled(ListStyles)`
  cursor: pointer;

  & > li {
    padding: 10px 8px;
    ${media.tabletL`
      padding: 1px;
    `}

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

  & > li.mobile-app {
    ${media.tabletL`
      display: none;
    `}
  }
`

export const NavButton = styled(Button)`
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
  isKycVerificationEnabled,
  isReferralAvailable,
  isReferralRetrievalEnabled,
  limitsClickHandler,
  logoutClickHandler,
  primaryNavItems,
  receiveClickHandler,
  referAFriendHandler,
  refreshClickHandler,
  sendClickHandler,
  taxCenterClickHandler,
  trackEventCallback
}: Props) => {
  const [isMobileNavOpen, setMobileNav] = useState(false)
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')

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
          <IconRefresh color={PaletteColors['grey-400']} size='small' />
        </NavButton>
      ),
      name: 'Refresh'
    },
    {
      component: () => (
        <UserNavDropdown
          isReferralAvailable={isReferralAvailable}
          isKycVerificationEnabled={isKycVerificationEnabled}
          isReferralRetrievalEnabled={isReferralRetrievalEnabled}
          limitsClickHandler={limitsClickHandler}
          referAFriendHandler={referAFriendHandler}
          logoutClickHandler={logoutClickHandler}
          taxCenterClickHandler={taxCenterClickHandler}
          trackEventCallback={trackEventCallback}
        />
      ),
      name: 'Settings'
    }
  ]

  const navigationFiltered = secondaryNavItems.filter(({ name }) => {
    if (!isKycVerificationEnabled) {
      return name !== 'Trade'
    }
    return true
  })

  const secondaryMobileNavItems = navigationFiltered.filter(
    ({ name }) => name !== 'Mobile App' && name !== 'Refresh' && name !== 'Settings'
  )

  return (
    <NavContainer>
      {isMobileNavOpen && (
        <MobileNav
          handleClose={closeMobileNavCallback}
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryMobileNavItems}
          userNavItems={userNavItems({
            isKycVerificationEnabled,
            isReferralAvailable,
            isReferralRetrievalEnabled,
            limitsClickHandler,
            logoutClickHandler,
            referAFriendHandler,
            taxCenterClickHandler,
            trackEventCallback
          })}
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
            {primaryNavItems.map(({ dest, e2e, isNew, text }: PrimaryNavItem) => (
              <li key={e2e}>
                <NavLink to={dest} data-e2e={e2e}>
                  <Flex alignItems='center' gap={6}>
                    <Padding vertical={0.625}>
                      <Text variant='paragraph1'>{text}</Text>
                    </Padding>
                    {isNew && (
                      <RoundedBadge>
                        <FormattedMessage defaultMessage='New' id='copy.new' />
                      </RoundedBadge>
                    )}
                  </Flex>
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
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={closeMobileNavCallback}
                    onKeyDown={closeMobileNavCallback}
                    data-e2e='closeMobileNav'
                  >
                    <IconClose color={PaletteColors['grey-600']} size='medium' />
                  </div>
                ) : (
                  <NavButton onClick={openMobileNavCallback} data-e2e='mobileNavExpand'>
                    <IconMenu color={PaletteColors['blue-500']} size='medium' />
                  </NavButton>
                )}
              </li>
            </>
          ) : (
            <>
              {navigationFiltered.map((item) => (
                <li key={item.name} className={item.name.toLowerCase()}>
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
  isKycVerificationEnabled: boolean
  isReferralAvailable: boolean
  isReferralRetrievalEnabled: boolean
  limitsClickHandler: () => void
  logoutClickHandler: () => void
  primaryNavItems: Array<PrimaryNavItem>
  receiveClickHandler: () => void
  referAFriendHandler: () => void
  refreshClickHandler: () => void
  sendClickHandler: () => void
  taxCenterClickHandler: () => void
  trackEventCallback: (eventName: string) => void
}

export default Navbar
