import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import {
  NavbarDivider,
  NavbarNavItem,
  NavbarNavItemButton,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader
} from 'components/Navbar'

import { Props } from '.'

const FeaturesLarge = (
  props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }
) => {
  return (
    <>
      <NavbarNavItem>
        <NavbarNavItemButton
          data-e2e='sendButton'
          disabled={!props.sendAvailable}
          onClick={() => props.showModal('SEND')}
        >
          <NavbarNavItemIcon size='18px' name='send' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.send' defaultMessage='Send' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
      <NavbarDivider />
      <NavbarNavItem>
        <NavbarNavItemButton
          data-e2e='requestButton'
          disabled={!props.requestAvailable}
          onClick={() => props.showModal('REQUEST')}
        >
          <NavbarNavItemIcon size='18px' name='request' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.request' defaultMessage='Request' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
      <NavbarDivider />
      <NavbarNavItem>
        <NavbarNavItemButton
          data-e2e='exchangeLink'
          onClick={() => props.swapActions.showModal('FeaturesTopNav')}
        >
          <NavbarNavItemIcon size='18px' name='arrow-switch-thick' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
      <NavbarDivider />
      <NavbarNavItem>
        <NavbarNavItemButton
          data-e2e='buyAndSellLink'
          onClick={() => props.simpleBuyActions.showModal('SideNav')}
        >
          <NavbarNavItemIcon size='18px' name='cart-filled' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage
              id='buttons.buy_sell_crypto'
              defaultMessage='Buy/Sell Crypto'
            />
          </NavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
      <NavbarDivider />
      <LinkContainer to='/interest' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemButton data-e2e='interestLink'>
            <NavbarNavItemIcon size='18px' name='percentage' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.earninterest'
                defaultMessage='Earn Interest'
              />
            </NavbarNavItemTextHeader>
          </NavbarNavItemButton>
        </NavbarNavItem>
      </LinkContainer>
      <NavbarDivider />
      <LinkContainer to='/borrow' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemButton data-e2e='borrowLink'>
            <NavbarNavItemIcon size='18px' name='borrow' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.borrow'
                defaultMessage='Borrow'
              />
            </NavbarNavItemTextHeader>
          </NavbarNavItemButton>
        </NavbarNavItem>
      </LinkContainer>
    </>
  )
}

export default FeaturesLarge
