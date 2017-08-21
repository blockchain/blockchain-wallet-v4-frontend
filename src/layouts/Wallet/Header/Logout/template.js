import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { NavItem } from 'react-bootstrap'

import { Text } from 'blockchain-info-components'

const Logout = (props) => {
  const { handleLogout } = props

  return (
    <NavItem onClick={handleLogout}>
      <Text size='14px' weight={300} color='white' uppercase>
        <FormattedMessage id='layouts.wallet.header.logout.signout' defaultMessage='Sign out' />
      </Text>
    </NavItem>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
