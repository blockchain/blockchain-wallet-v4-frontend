import { Destination } from 'components/MenuLeft'
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuItem
} from 'components/Navbar/NavbarDropdown'
import { FormattedMessage } from 'react-intl'
import { Icon, Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem,
  NavbarNavItemIcon
} from 'components/Navbar'
import { NavLink } from 'react-router-dom'
import { Props as OwnProps } from '.'
import { useOnClickOutside } from 'services/HooksService'
import Balances from '../MenuLeft/Balances'
import Features from './Features'
import media from 'services/ResponsiveService'
import React, { useRef, useState } from 'react'
import SecurityCenter from './SecurityCenter'
import Settings from './Settings'
import styled from 'styled-components'

type Props = {
  handleToggle: () => void
} & OwnProps

const Spacer = styled.div``

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
    margin-left: 12px;
  `}
`

const NavbarBottomStyled = styled(Navbar)`
  display: flex;
  width: auto;
  margin: 0 26px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.whiteFade100};
  ${media.tablet`
    margin: 0;
    padding: 0 15px;
    width: 100%;
  `}
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
      <Navbar>
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
        <NavbarMenu>
          <Spacer />
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
              <NavbarNavItemIcon name='cog-filled' />
              {isMenuOpen && (
                <DropdownMenu ref={ref}>
                  <DropdownMenuArrowStyled />
                  <DropdownMenuItem
                    data-e2e='notificationsLink'
                    onClick={() =>
                      props.modalActions.showModal('WHATS_NEW_MODAL', {
                        origin: 'WhatsNewHeader'
                      })
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
        </NavbarMenu>
      </Navbar>
      <NavbarBottomStyled height='60px'>
        <Balances />
        <Features />
      </NavbarBottomStyled>
    </NavbarContainer>
  )
}

export default Small
