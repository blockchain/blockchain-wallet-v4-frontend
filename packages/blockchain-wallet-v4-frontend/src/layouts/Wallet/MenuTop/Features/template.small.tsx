import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import React, { useRef, useState } from 'react'

import { Destination } from 'components/MenuLeft'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuItem
} from 'components/Navbar/NavbarDropdown'
import {
  NavbarNavItemButton,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader
} from 'components/Navbar'
import { useOnClickOutside } from 'services/HooksService'

import { Props } from '.'

const FeaturesSmall = (
  props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }
) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  return (
    <NavbarNavItemButton
      data-e2e='featuresSmall'
      onClick={() => toggleIsMenuOpen(!isMenuOpen)}
    >
      <NavbarNavItemIcon
        persist
        name='plus-in-circle-filled'
        size='18px'
        color='alwaysWhite'
      />
      <NavbarNavItemTextHeader persist color='alwaysWhite'>
        <FormattedMessage id='buttons.transact' defaultMessage='Transact' />
      </NavbarNavItemTextHeader>
      <Icon
        name={isMenuOpen ? 'chevron-up' : 'chevron-down'}
        size='24px'
        color='alwaysWhite'
      />
      {isMenuOpen && (
        <DropdownMenu ref={ref}>
          <DropdownMenuArrow />
          <DropdownMenuItem
            data-e2e='sendButton'
            disabled={!props.sendAvailable}
            onClick={() => props.showModal('SEND')}
          >
            <Destination>
              <FormattedMessage id='buttons.send' defaultMessage='Send' />
            </Destination>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-e2e='requestButton'
            disabled={!props.requestAvailable}
            onClick={() => props.showModal('REQUEST')}
          >
            <Destination>
              <FormattedMessage id='buttons.request' defaultMessage='Request' />
            </Destination>
          </DropdownMenuItem>
          <LinkContainer to='/swap' activeClassName='active'>
            <DropdownMenuItem data-e2e='exchangeLink'>
              <Destination>
                <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <DropdownMenuItem
            data-e2e='buyAndSellLink'
            onClick={() => props.simpleBuyActions.showModal('SideNav')}
          >
            <Destination>
              <FormattedMessage
                id='buttons.buy_crypto'
                defaultMessage='Buy Crypto'
              />
            </Destination>
          </DropdownMenuItem>
          <LinkContainer to='/interest' activeClassName='active'>
            <DropdownMenuItem data-e2e='interestLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.earninterest'
                  defaultMessage='Earn Interest'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          <LinkContainer to='/borrow' activeClassName='active'>
            <DropdownMenuItem data-e2e='borrowLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.borrow'
                  defaultMessage='Borrow'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
        </DropdownMenu>
      )}
    </NavbarNavItemButton>
  )
}

export default FeaturesSmall
