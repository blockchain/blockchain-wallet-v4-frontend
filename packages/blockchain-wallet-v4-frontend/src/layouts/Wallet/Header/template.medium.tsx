import { Destination } from 'components/MenuLeft'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuItem
} from 'components/Navbar/NavbarDropdown'
import { FormattedMessage } from 'react-intl'
import { Icon, Image } from 'blockchain-info-components'
import { LinkDispatchPropsType } from '.'
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
import media from 'services/ResponsiveService'
import React, { useRef, useState } from 'react'
import SecurityCenter from './SecurityCenter'
import SendRequest from './SendRequest'
import Settings from './Settings'
import styled from 'styled-components'

type Props = {
  handleToggle: () => void
} & LinkDispatchPropsType

const NavbarContainer = styled.div`
  background-color: ${props => props.theme.grey900};
`

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

const NavbarStyled = styled(Navbar)``

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
    <NavbarContainer>
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
          <SendRequest />
          <NavbarNav>
            <NavbarNavItemWithText>
              <SecurityCenter />
            </NavbarNavItemWithText>
            <NavbarNavItemWithText>
              <Settings {...props} />
            </NavbarNavItemWithText>
            <NavbarNavItemWithText
              onClick={() => toggleIsMenuOpen(!isMenuOpen)}
            >
              <NavbarNavItemTextIcon
                className='icon'
                size='6px'
                color='white'
                name='ellipsis'
              />
              {isMenuOpen && (
                <DropdownMenu ref={ref}>
                  <DropdownMenuArrowStyled />
                  <DropdownMenuItem
                    data-e2e='notificationsLink'
                    onClick={() =>
                      props.modalActions.showModal('WHATS_NEW_MODAL')
                    }
                  >
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.small.whats_new'
                        defaultMessage="What's New?"
                      />
                    </Destination>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-e2e='refreshLink'
                    onClick={() => props.refreshActions.refreshClicked()}
                  >
                    <Destination>
                      <FormattedMessage
                        id='layouts.wallet.header.small.refresh'
                        defaultMessage='Refresh'
                      />
                    </Destination>
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </NavbarNavItemWithText>
          </NavbarNav>
        </NavbarMenuStyled>
      </NavbarStyled>
    </NavbarContainer>
  )
}

export default Small
