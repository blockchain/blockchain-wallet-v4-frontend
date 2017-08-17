import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { NavItem, Text } from 'blockchain-info-components'

const Logout = (props) => {
  const { handleLogout } = props

  return (
    <NavItem onClick={handleLogout}>
      <Text white>
        <FormattedMessage id='components.layouts.wallet.header.logout.signout' defaultMessage='Sign out' />
      </Text>
    </NavItem>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
