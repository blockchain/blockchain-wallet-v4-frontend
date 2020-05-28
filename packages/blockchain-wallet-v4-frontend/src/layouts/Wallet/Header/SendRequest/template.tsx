import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'

import {
  NavbarDivider,
  NavbarMenu,
  NavbarNavItem,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader,
  NavbarNavItemTextLink
} from 'components/Navbar'
import { Props } from '.'

const SendRequest = (
  props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }
) => {
  return (
    <NavbarMenu>
      <NavbarNavItem>
        <NavbarNavItemTextLink
          data-e2e='sendButton'
          disabled={!props.sendAvailable}
          onClick={() => props.showModal('SEND')}
        >
          <NavbarNavItemIcon size='18px' name='send' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.send' defaultMessage='Send' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemTextLink>
      </NavbarNavItem>
      <NavbarDivider />
      <NavbarNavItem>
        <NavbarNavItemTextLink
          data-e2e='requestButton'
          disabled={!props.requestAvailable}
          onClick={() => props.showModal('REQUEST')}
        >
          <NavbarNavItemIcon size='18px' name='request' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.request' defaultMessage='Request' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemTextLink>
      </NavbarNavItem>
      <NavbarDivider />
      <LinkContainer to='/swap' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemTextLink data-e2e='exchangeLink'>
            <NavbarNavItemIcon size='18px' name='arrow-switch-thick' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
            </NavbarNavItemTextHeader>
          </NavbarNavItemTextLink>
        </NavbarNavItem>
      </LinkContainer>
      <NavbarDivider />
      <NavbarNavItem>
        <NavbarNavItemTextLink
          data-e2e='buyAndSellLink'
          onClick={() => props.simpleBuyActions.showModal('SideNav')}
        >
          <NavbarNavItemIcon size='18px' name='cart-filled' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage
              id='buttons.buy_crypto'
              defaultMessage='Buy Crypto'
            />
          </NavbarNavItemTextHeader>
        </NavbarNavItemTextLink>
      </NavbarNavItem>
      <NavbarDivider />
      <LinkContainer to='/interest' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemTextLink data-e2e='interestLink'>
            <NavbarNavItemIcon size='18px' name='percentage' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.earninterest'
                defaultMessage='Earn Interest'
              />
            </NavbarNavItemTextHeader>
          </NavbarNavItemTextLink>
        </NavbarNavItem>
      </LinkContainer>
      <NavbarDivider />
      <LinkContainer to='/borrow' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemTextLink data-e2e='interestLink'>
            <NavbarNavItemIcon size='18px' name='borrow' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.borrow'
                defaultMessage='Borrow'
              />
            </NavbarNavItemTextHeader>
          </NavbarNavItemTextLink>
        </NavbarNavItem>
      </LinkContainer>
    </NavbarMenu>
  )
}

export default SendRequest
