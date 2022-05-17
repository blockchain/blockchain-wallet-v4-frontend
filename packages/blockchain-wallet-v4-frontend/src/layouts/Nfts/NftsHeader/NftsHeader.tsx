import React, { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconUser, IconWallet } from '@blockchain-com/icons'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import AppSwitcher from 'components/NavbarV2/AppSwitcher'
import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from 'components/NavbarV2/Dropdown'
import {
  DropdownNavLink,
  Logo,
  NavButton,
  NavContainer,
  NavLeft,
  NavRight
} from 'components/NavbarV2/Navbar'
import { actions } from 'data'
import { Analytics, ModalName } from 'data/types'
import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'
import { media, useMedia } from 'services/styles'

import { Props as OwnProps } from '../Nfts'
import NftsSearch from './NftsSearch'

export const FIXED_HEADER_HEIGHT = 56

const StickyNav = styled(NavContainer)`
  top: 0;
  z-index: 3;
  position: fixed;
  background-color: ${colors.white900};
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const NavCenter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 40px;
  ${media.tablet`
    width: auto;
  `}
`
const NavLinkButton = styled(Link)`
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  margin-right: 12px;
  background-color: ${(props) => props.theme.purple000};
  * {
    color: ${(props) => props.theme.purple600};
  }
`

const ExploreHeader: React.FC<Props> = ({
  ethAddress,
  isAuthenticated,
  modalActions,
  pathname
}) => {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const trackExploreClicked = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_EXPLORER_CLICKED,
        properties: {}
      })
    )
  }
  const isTablet = useMedia('tablet')
  const [isMenuOpen, toggleIsMenuOpen] = React.useState<boolean>(false)

  const handleMenuToggle = () => {
    toggleIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }

  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  const navItems = [
    {
      copy: <FormattedMessage id='navbar.settings.general' defaultMessage='General' />,
      'data-e2e': 'settings_generalLink',
      to: '/settings/general'
    },
    {
      copy: <FormattedMessage id='navbar.nfts.my_portfolio' defaultMessage='NFTs Portfolio' />,
      'data-e2e': '',
      to: `/nfts/address/${ethAddress}`
    },
    {
      copy: <FormattedMessage id='navbar.nfts.my_portfolio' defaultMessage='NFTs Notifications' />,
      'data-e2e': '',
      to: `/nfts/address/settings/${ethAddress}`
    },
    {
      clickHandler: () => window.location.reload(),
      copy: <FormattedMessage id='layouts.wallet.header.Sign Out' defaultMessage='Sign Out' />,
      'data-e2e': 'logoutLink'
    }
  ]

  return (
    <StickyNav>
      <NavLeft>
        <Logo>
          <NavLink to='/home' data-e2e='homeLink'>
            <Image width='25px' name='blockchain-icon' />
          </NavLink>
        </Logo>
        <AppSwitcher />
      </NavLeft>
      <NavCenter>
        {isTablet ? null : (
          <LinkContainer onClick={trackExploreClicked} to='/nfts/explore'>
            <NavLinkButton>
              <Flex alignItems='center' gap={4}>
                <Text size='14px' weight={600}>
                  <FormattedMessage id='copy.explore' defaultMessage='Explore' />
                </Text>
              </Flex>
            </NavLinkButton>
          </LinkContainer>
        )}
        <NftsSearch />
      </NavCenter>
      <NavRight>
        {isAuthenticated ? (
          <Flex gap={8} alignItems='center'>
            <Button
              small
              data-e2e='back'
              nature='empty-purple'
              onClick={() =>
                modalActions.showModal(ModalName.ETH_WALLET_BALANCES, { origin: 'Unknown' })
              }
            >
              <Icon label='wallet' size='sm' color='purple600'>
                <IconWallet />
              </Icon>
              <span style={{ marginLeft: '4px' }}>
                <FormattedMessage id='copy.wallet' defaultMessage='Wallet' />
              </span>
            </Button>
            <NavButton onClick={handleMenuToggle} data-e2e='settingsLink'>
              <Icon color='grey400' label='open-menu' size='sm'>
                <IconUser />
              </Icon>
              {isMenuOpen && (
                <DropdownMenu ref={ref}>
                  <DropdownMenuArrow />
                  {navItems.map(({ clickHandler = () => {}, copy, 'data-e2e': e2e, to }) => {
                    if (!to) {
                      return (
                        <DropdownMenuItem key={e2e} onClick={clickHandler} data-e2e={e2e}>
                          <Destination>{copy}</Destination>
                        </DropdownMenuItem>
                      )
                    }
                    return (
                      <DropdownNavLink key={e2e} to={to}>
                        <DropdownMenuItem
                          data-e2e={e2e}
                          onClick={() => (clickHandler ? clickHandler() : undefined)}
                        >
                          <Destination>{copy}</Destination>
                        </DropdownMenuItem>
                      </DropdownNavLink>
                    )
                  })}
                </DropdownMenu>
              )}
            </NavButton>
          </Flex>
        ) : (
          <>
            <LinkContainer
              style={isTablet ? {} : { marginRight: '8px' }}
              to={`/open${pathname}`}
              data-e2e='loginLink'
            >
              <Button small data-e2e='login' nature='empty-purple'>
                <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
              </Button>
            </LinkContainer>
            {isTablet ? null : (
              <LinkContainer to={`/open${pathname}`} data-e2e='signupLink'>
                <Button small data-e2e='signup' nature='primary'>
                  <FormattedMessage id='buttons.signup' defaultMessage='Sign Up' />
                </Button>
              </LinkContainer>
            )}
          </>
        )}
      </NavRight>
    </StickyNav>
  )
}

type Props = OwnProps

export default reduxForm<{}, Props>({ form: 'nftSearch' })(ExploreHeader)
