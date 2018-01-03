import React from 'react'
import PropTypes from 'prop-types'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Success = props => {
  const { etherBalance } = props
  return <SwitchableDisplay coin='ETH' size='24px' weight={100} showIcon>{etherBalance}</SwitchableDisplay>
}

Success.propTypes = {
  ethereBalance: PropTypes.string.isRequired
}

export default Success
