import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import styled from 'styled-components'

import {
  NavbarNavItem,
  NavbarNavItemButton,
  NavbarNavItemIcon,
  NavbarNavItemTextHeader
} from 'components/Navbar'
import media from 'services/ResponsiveService'

const StyledNavbarNavItemTextHeader = styled(NavbarNavItemTextHeader)`
  ${media.laptop`
    display: none;
  `}
`

const SecurityCenter = () => {
  return (
    <LinkContainer activeClassName='active' to='/security-center'>
      <NavbarNavItem>
        <NavbarNavItemButton data-e2e='securityCenterLink'>
          <NavbarNavItemIcon persist size='18px' name='shield' />
          <StyledNavbarNavItemTextHeader size='14px' weight={600}>
            <FormattedMessage id='buttons.security' defaultMessage='Security' />
          </StyledNavbarNavItemTextHeader>
        </NavbarNavItemButton>
      </NavbarNavItem>
    </LinkContainer>
  )
}

export default SecurityCenter
