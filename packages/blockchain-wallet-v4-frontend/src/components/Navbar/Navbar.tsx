import React, { useCallback, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { colors, Icon, Text } from '@blockchain-com/constellation'
import { IconClose, IconMenu, IconRefresh } from '@blockchain-com/icons'
import ProgressBar from '@ramonak/react-progress-bar'
import styled from 'styled-components'

import { Button, Image } from 'blockchain-info-components'
import FabButton from 'components/FabButton'
import { media, useMedia } from 'services/styles'

import MobileDropdown from './MobileDropdown'
import MobileNav from './MobileNav'
import UserNavDropdown, { userNavItems } from './UserNavDropdown'

export type PrimaryNavItem = {
  dest: string
  e2e: string
  text: string | React.ReactNode
}

export const NavContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.white100};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 22px;
  border-bottom: 1px solid ${colors.grey000};
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
    color: ${colors.blue500};
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

    &.refresh:active,
    &.refresh:focus {
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
  limitsClickHandler,
  logoutClickHandler,
  nftsEnabled,
  primaryNavItems,
  receiveClickHandler,
  refreshClickHandler,
  sendClickHandler,
  taxCenterClickHandler,
  trackEventCallback
}: Props) => {
  const [isMobileNavOpen, setMobileNav] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')

  useHotkeys('cmd+r', (e) => {
    e.preventDefault()
    setProgressWidth(30)
    // delay refresh so progress bar animation isn't interrupted
    setTimeout(() => {
      refreshClickHandler()
    }, 200)

    // while data refreshes, dalay finishing progress bar
    setTimeout(() => {
      setProgressWidth(100)

      // reset progress bar after slight delay
      setTimeout(() => {
        setProgressWidth(0)
      }, 2000)
    }, 3000)
  })

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
          <Icon color='grey400' label='refresh' size='sm'>
            <IconRefresh />
          </Icon>
        </NavButton>
      ),
      name: 'Refresh'
    },
    {
      component: () => (
        <UserNavDropdown
          limitsClickHandler={limitsClickHandler}
          logoutClickHandler={logoutClickHandler}
          taxCenterClickHandler={taxCenterClickHandler}
          trackEventCallback={trackEventCallback}
        />
      ),
      name: 'Settings'
    }
  ]
  const secondaryMobileNavItems = secondaryNavItems.filter(
    ({ name }) => name !== 'Mobile App' && name !== 'Refresh' && name !== 'Settings'
  )

  return (
    <NavContainer>
      <div style={{ left: '0', position: 'absolute', top: '0', width: '100%' }}>
        <ProgressBar
          completed={progressWidth}
          height='3px'
          width='100%'
          bgColor={colors.blue600}
          isLabelVisible={false}
          baseBgColor='white'
          borderRadius='0px'
          transitionDuration={progressWidth === 100 ? '1s' : '0.2s'}
          transitionTimingFunction='ease-in'
        />
      </div>
      {isMobileNavOpen && (
        <MobileNav
          handleClose={closeMobileNavCallback}
          primaryNavItems={primaryNavItems}
          secondaryNavItems={secondaryMobileNavItems}
          userNavItems={userNavItems({
            limitsClickHandler,
            logoutClickHandler,
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
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={closeMobileNavCallback}
                    onKeyDown={closeMobileNavCallback}
                    data-e2e='closeMobileNav'
                  >
                    <Icon color='grey600' label='close-menu' size='md'>
                      <IconClose />
                    </Icon>
                  </div>
                ) : (
                  <NavButton onClick={openMobileNavCallback} data-e2e='mobileNavExpand'>
                    <Icon label='open-menu' color='blue500' size='md'>
                      <IconMenu />
                    </Icon>
                  </NavButton>
                )}
              </li>
            </>
          ) : (
            <>
              {secondaryNavItems.map((item) => (
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
  limitsClickHandler: () => void
  logoutClickHandler: () => void
  nftsEnabled: boolean
  primaryNavItems: Array<PrimaryNavItem>
  receiveClickHandler: () => void
  refreshClickHandler: () => void
  sendClickHandler: () => void
  taxCenterClickHandler: () => void
  trackEventCallback: (eventName: string) => void
}

export default Navbar
