import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { FormattedMessage } from 'react-intl'
import {
  NavbarNavItemTextLink,
  NavbarNavItemTextHeader,
  NavbarNavItemTextIcon
} from 'components/Navbar'

const SecurityCenter = props => {
  const onSecurityCenterClick = event => {
    props.dispatch({
      type: `ROOT_LOCATION_CHANGE`,
      payload: { action: `PUSH`, location: { pathname: `/security-center` } }
    })

    event.preventDefault()
  }

  return (
    <LinkContainer
      data-e2e='securityCenterLink'
      activeClassName='active'
      onClick={onSecurityCenterClick}
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
