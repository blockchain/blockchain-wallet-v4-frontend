import React from 'react'
import { FormattedMessage } from 'react-intl'

const Logout = () => {
  return (
    <li className='nav-item active'>
      <a className='nav-link' href='#'>
        <FormattedMessage id='components.layouts.wallet.header.logout.signout' defaultMessage='Sign out' />
      </a>
    </li>
  )
}

export default Logout
