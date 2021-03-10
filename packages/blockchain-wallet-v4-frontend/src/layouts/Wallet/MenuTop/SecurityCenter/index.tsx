import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import {
  NavbarNavItem,
  NavbarNavItemButton,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader
} from 'components/Navbar'
import { media } from 'services/styles'

const StyledNavbarNavItemTextHeader = styled(NavbarNavItemTextHeader)`
  ${media.laptop`
    display: none;
  `}
`

const StyledNavbarNavItem = styled(NavbarNavItem)`
  &:first-child {
    ${media.laptopM`
      padding: 4px 16px;
      margin: 0 -2px;
    `}

    ${media.laptop`
      padding: 0 16px;
      margin: 0 2px;
    `}

    ${media.tablet`
      padding: 0px 8px;
      &:last-child {
        padding-right: 0px;
      }
    `}   
  }
`

const SecurityCenter = () => {
  return (
    <LinkContainer activeClassName='active' to='/security-center'>
      <StyledNavbarNavItem>
        <NavbarNavItemButton data-e2e='securityCenterLink'>
          <NavbarNavItemIcon persist size='18px' name='shield' />
          <StyledNavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.security' defaultMessage='Security' />
          </StyledNavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </StyledNavbarNavItem>
    </LinkContainer>
  )
}

export default SecurityCenter
