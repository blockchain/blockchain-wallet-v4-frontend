import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import {
  NavbarNavItemTextHeader,
  NavbarNavItemTextIcon,
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
        <NavbarNavItemTextIcon
          className='icon'
          size='18px'
          color='white'
          name='shield'
        />
        <NavbarNavItemTextHeader
          size='14px'
          weight={600}
          color='white'
          className='settings'
        >
          <FormattedMessage
            id='layouts.wallet.header.seccenter'
            defaultMessage='Security Center'
          />
        </NavbarNavItemTextHeader>
      </NavbarNavItemTextLink>
    </LinkContainer>
  )
}

export default SecurityCenter
