import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Logout = (props) => {
  const { handleLogout } = props

  return (
    <Text size='14px' weight={300} color='white' uppercase onClick={handleLogout}>
      <FormattedMessage id='layouts.wallet.header.logout.signout' defaultMessage='Sign out' />
    </Text>
  )
}

Logout.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default Logout
