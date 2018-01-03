import React from 'react'
import PropTypes from 'prop-types'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Success = props => {
  const { bitcoinBalance } = props
  return <SwitchableDisplay coin='BTC' size='24px' weight={100} showIcon>{bitcoinBalance}</SwitchableDisplay>
}

Success.propTypes = {
  bitcoinBalance: PropTypes.string.isRequired
}

export default Success
