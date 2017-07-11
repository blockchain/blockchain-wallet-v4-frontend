import React from 'react'
import { NavItem } from 'components/generic/Navbar'
import { Text } from 'components/generic/Text'

const Logout = () => {
  return (
    <NavItem>
      <Text id='components.layouts.wallet.header.logout.signout' text='Sign out' small light white />
    </NavItem>
  )
}

export default Logout
