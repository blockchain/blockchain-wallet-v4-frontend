import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon, Link } from 'blockchain-info-components'

const LogoutLink = styled(Link)`
  > span:first-child {
    display: none;
  }
  > span:last-child {
    display: inherit;
  }
  @media (min-width: 768px) {
    > span:first-child {
      display: flex;
    }
    > span:last-child {
      display: none;
    }
  }
`

const Logout = props => {
  const { handleLogout } = props

  return (
    <LogoutLink
      size='14px'
      weight={300}
      color='white'
      onClick={handleLogout}
      data-e2e='logoutLink'
    >
      <FormattedMessage
        id='layouts.wallet.header.signout'
        defaultMessage='Sign Out'
      />
      <Icon name='switch' size='18px' color='white' />
    </LogoutLink>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
