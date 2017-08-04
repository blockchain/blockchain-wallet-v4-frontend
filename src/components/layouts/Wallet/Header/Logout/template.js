import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'components/generic/Navbar'
import { Text } from 'components/generic/Text'

const Logout = (props) => {
  const { handleLogout } = props

  return (
    <NavItem onClick={handleLogout}>
      <Text id='components.layouts.wallet.header.logout.signout' text='Sign out' small light white />
    </NavItem>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
