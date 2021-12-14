import React from 'react'
import { NavLink } from 'react-router-dom'

import FlyoutContainer from '../Flyout/Container'
import FlyoutContent from '../Flyout/Content'
import FlyoutHeader from '../Flyout/Header'
import { CheckoutRow } from '../Rows'
import { PrimaryNavItem } from './Navbar'

const MobileNav = ({
  handleClose,
  primaryNavItems,
  secondaryNavItems,
  tertiaryNavItems
}: Props) => {
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
          {primaryNavItems.map((item: PrimaryNavItem) => (
            <li
              role='menuitem'
              style={{ listStyleType: 'none' }}
              key={item.e2e}
              onClick={handleClose}
              onKeyDown={handleClose}
            >
              <NavLink to={item.dest} data-e2e={item.e2e}>
                <CheckoutRow title={item.text} />
              </NavLink>
            </li>
          ))}
          {secondaryNavItems.map((item) => (
            <li
              role='menuitem'
              style={{ listStyleType: 'none' }}
              key={item.name}
              onClick={handleClose}
              onKeyDown={handleClose}
            >
              <CheckoutRow title={item.name} />
            </li>
          ))}
          {tertiaryNavItems.map((item) => (
            <li
              role='menuitem'
              style={{ listStyleType: 'none' }}
              key={item.to}
              onClick={handleClose}
              onKeyDown={handleClose}
            >
              {item.copy}
            </li>
          ))}
        </FlyoutContent>
      </FlyoutContainer>
    </div>
  )
}

type Props = {
  handleClose: () => void
  primaryNavItems: PrimaryNavItem[]
  secondaryNavItems: { component: React.ReactNode; name: string }[]
  tertiaryNavItems: ({
    'data-e2e': string
    to?: never
    copy: React.ReactNode
    onClick: () => void
  } | {
    'data-e2e': string
    to: string
    copy: React.ReactNode
    onClick?: never
  })[]
}
export default MobileNav
