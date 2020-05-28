import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  NavbarNavItemIcon,
  NavbarNavItemTextHeader,
  NavbarNavItemTextLink
} from 'components/Navbar'
import React from 'react'

const SecurityCenter = () => {
  return (
    <LinkContainer
      data-e2e='securityCenterLink'
      activeClassName='active'
      to='/security-center'
    >
      <NavbarNavItemTextLink>
        <NavbarNavItemIcon size='18px' name='shield' />
        <NavbarNavItemTextHeader size='14px' weight={600}>
          <FormattedMessage id='buttons.security' defaultMessage='Security' />
        </NavbarNavItemTextHeader>
      </NavbarNavItemTextLink>
    </LinkContainer>
  )
}

export default SecurityCenter
