import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Image } from 'blockchain-info-components'
import {
  NavbarDivider,
  NavbarNavItem,
  NavbarNavItemButton,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader
} from 'components/Navbar'

import { Props } from '.'

const FeaturesLarge = (props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }) => {
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
          onClick={() => props.swapActions.showModal({ origin: 'FeaturesTopNav' })}
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
          onClick={() => props.buySellActions.showModal({ origin: 'SideNav' })}
        >
          <NavbarNavItemIcon size='18px' name='cart-filled' />
          <NavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.buy_sell_crypto' defaultMessage='Buy/Sell Crypto' />
          </NavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
      <NavbarDivider />
      <LinkContainer to='/rewards' activeClassName='active'>
        <NavbarNavItem>
          <NavbarNavItemButton data-e2e='interestLink'>
            <NavbarNavItemIcon size='18px' name='percentage' />
            <NavbarNavItemTextHeader size='14px' weight={600}>
              <FormattedMessage
                id='layouts.wallet.menuleft.navigation.earninterest'
                defaultMessage='Earn Rewards'
              />
            </NavbarNavItemTextHeader>
          </NavbarNavItemButton>
        </NavbarNavItem>
      </LinkContainer>
      <NavbarDivider />
      {props.invitations.nfts ? (
        <LinkContainer to='/nfts' activeClassName='active'>
          <NavbarNavItem>
            <NavbarNavItemButton data-e2e='nftsLink'>
              <Image name='nft' height='50%' style={{ marginRight: '8px' }} />
              <NavbarNavItemTextHeader size='14px' weight={600}>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.nfts'
                  defaultMessage='NFTs'
                />
                &nbsp;(Beta)
              </NavbarNavItemTextHeader>
            </NavbarNavItemButton>
          </NavbarNavItem>
        </LinkContainer>
      ) : null}
      <NavbarDivider />
      {props.walletConnectEnabled ? (
        <LinkContainer to='/dapps' activeClassName='active'>
          <NavbarNavItem>
            <NavbarNavItemButton data-e2e='dappsLink'>
              <Image name='walletconnect-circle-logo' height='50%' style={{ marginRight: '8px' }} />
              <NavbarNavItemTextHeader size='14px' weight={600}>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.dapps'
                  defaultMessage='Dapps'
                />
              </NavbarNavItemTextHeader>
            </NavbarNavItemButton>
          </NavbarNavItem>
        </LinkContainer>
      ) : null}
    </>
  )
}

export default FeaturesLarge
