import { Destination } from 'components/MenuLeft'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuItem
} from 'components/Navbar/NavbarDropdown'
import { FormattedMessage } from 'react-intl'
import { Icon, Image, Text } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem,
  NavbarNavItemTextIcon
} from 'components/Navbar'
import { NavLink } from 'react-router-dom'
import { useOnClickOutside } from 'services/HooksService'
import FaqIcon from './FaqIcon'
import media from 'services/ResponsiveService'
import React, { useRef, useState } from 'react'
import RefreshIcon from './RefreshIcon'
import SecurityCenter from './SecurityCenter'
import SendRequest from './SendRequest'
import Settings from './Settings'
import styled from 'styled-components'
import WhatsNewIcon from './WhatsNewIcon'

type Props = {
  handleToggle: () => void
}

const Spacer = styled.div``

const NavbarNavItemWithText = styled(NavbarNavItem)`
  padding: 0px;
  border-left: 0px;
  margin-right: 12px;
  &:last-child {
    padding-right: 0;
  }
`

const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 20px;
  width: 160px;
  ${media.tablet`
    margin-left: 6px;
  `}
`

const NavbarStyled = styled(Navbar)`
  background-color: ${props => props.theme.grey900};
`

const NavbarMenuStyled = styled(NavbarMenu)`
  width: 100%;
`

const DropdownMenuArrowStyled = styled(DropdownMenuArrow)`
  ${media.tabletL`
    right: 20px;
  `}
`

const Small: React.FC<Props> = props => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  return (
    <NavbarStyled height='60px'>
      <NavbarHeader>
        <NavbarBrand>
          <Icon
            name='hamburger-menu'
            color='whiteFade600'
            size='16px'
            onClick={props.handleToggle}
          />
          <NavLink to='/home' data-e2e='homeLink'>
            <BlockchainLogoImage name='blockchain-logo' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenuStyled>
        <Spacer />
        <NavbarNav>
          <NavbarNavItemWithText>
            <SecurityCenter />
          </NavbarNavItemWithText>
          <NavbarNavItemWithText>
            <Settings {...props} />
          </NavbarNavItemWithText>
          <NavbarNavItemWithText onClick={() => toggleIsMenuOpen(!isMenuOpen)}>
            <NavbarNavItemTextIcon
              className='icon'
              size='6px'
              color='white'
              name='ellipsis'
            />
            {isMenuOpen && (
              <DropdownMenu ref={ref}>
                <DropdownMenuArrowStyled />
                <DropdownMenuItem data-e2e='settings_generalLink'>
                  <Destination>
                    <FormattedMessage
                      id='layouts.wallet.header.general'
                      defaultMessage='General'
                    />
                  </Destination>
                </DropdownMenuItem>
                <LinkContainer to='/settings/profile' activeClassName='active'>
                  <DropdownMenuItem data-e2e='settings_profileLink'>
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.profile'
                        defaultMessage='Profile'
                      />
                    </Destination>
                  </DropdownMenuItem>
                </LinkContainer>
                <LinkContainer
                  to='/settings/preferences'
                  activeClassName='active'
                >
                  <DropdownMenuItem data-e2e='settings_preferencesLink'>
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.preferences'
                        defaultMessage='Preferences'
                      />
                    </Destination>
                  </DropdownMenuItem>
                </LinkContainer>
                <LinkContainer
                  to='/settings/addresses'
                  activeClassName='active'
                >
                  <DropdownMenuItem data-e2e='settings_walletsLink'>
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.walletsaddresses'
                        defaultMessage='Wallets & Addresses'
                      />
                    </Destination>
                  </DropdownMenuItem>
                </LinkContainer>
              </DropdownMenu>
            )}
          </NavbarNavItemWithText>
        </NavbarNav>
      </NavbarMenuStyled>
    </NavbarStyled>
  )
}

export default Small
