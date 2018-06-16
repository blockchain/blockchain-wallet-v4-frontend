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

const Logout = (props) => {
  const { handleLogout } = props

  return (
    <LogoutLink size='14px' weight={300} color='white' uppercase onClick={handleLogout}>
      <FormattedMessage id='layouts.wallet.header.logout.signout' defaultMessage='Sign out' />
      <Icon name='switch' size='16px' color='white' />
    </LogoutLink>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
