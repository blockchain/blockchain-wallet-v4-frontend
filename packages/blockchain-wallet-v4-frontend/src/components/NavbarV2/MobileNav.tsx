import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import FlyoutContainer from '../Flyout/Container'
import FlyoutContent from '../Flyout/Content'
import FlyoutHeader from '../Flyout/Header'
import { CheckoutRow } from '../Rows'
import { PrimaryNavItem } from './Navbar'

const MobileNavList = styled.ul`
  margin: 0;
  padding: 0;
`

const StyledLi = styled.li`
  list-style-type: none;

  & > a {
    text-decoration: none;
  }
`

const MobileNav = ({
  handleClose,
  primaryNavItems,
  secondaryNavItems,
  tertiaryNavItems
}: Props) => {
  const clickAndClose = (clickHandler: () => void = () => {}) => {
    return () => {
      clickHandler()
      handleClose()
    }
  }
  return (
    <div
      style={{
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 99999
      }}
    >
      <FlyoutContainer>
        <FlyoutHeader mode='close' data-e2e='MobileNavFlyout' onClick={handleClose} />
        <FlyoutContent mode='top'>
          <MobileNavList>
            {primaryNavItems.map((item: PrimaryNavItem) => (
              <StyledLi key={item.e2e}>
                <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                  <NavLink to={item.dest} data-e2e={item.e2e}>
                    <CheckoutRow title={item.text} />
                  </NavLink>
                </div>
              </StyledLi>
            ))}
            {secondaryNavItems.map(({ name, clickHandler = () => {} }) => (
              <StyledLi key={name}>
                <div
                  role='button'
                  tabIndex={0}
                  onClick={clickAndClose(clickHandler)}
                  onKeyDown={clickHandler}
                >
                  <CheckoutRow title={name} />
                </div>
              </StyledLi>
            ))}
            {tertiaryNavItems.map(({ clickHandler, copy, 'data-e2e': e2e, to }) => (
              <StyledLi key={to}>
                {to ? (
                  <div role='button' tabIndex={0} onClick={handleClose} onKeyDown={handleClose}>
                    <NavLink to={to} data-e2e={e2e}>
                      <CheckoutRow title={copy} />
                    </NavLink>
                  </div>
                ) : (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={clickAndClose(clickHandler)}
                    onKeyDown={clickHandler}
                  >
                    <CheckoutRow title={copy} />
                  </div>
                )}
              </StyledLi>
            ))}
          </MobileNavList>
        </FlyoutContent>
      </FlyoutContainer>
    </div>
  )
}

type Props = {
  handleClose: () => void
  primaryNavItems: PrimaryNavItem[]
  secondaryNavItems: { clickHandler?: () => void; component: React.ReactNode; name: string }[]
  tertiaryNavItems: (
    | {
        clickHandler: () => void
        copy: React.ReactNode
        'data-e2e': string
        to?: never
      }
    | {
        clickHandler?: never
        copy: React.ReactNode
        'data-e2e': string
        to: string
      }
  )[]
}
export default MobileNav
