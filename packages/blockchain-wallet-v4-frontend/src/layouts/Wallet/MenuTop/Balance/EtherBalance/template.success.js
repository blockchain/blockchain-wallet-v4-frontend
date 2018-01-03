import React from 'react'
import PropTypes from 'prop-types'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Success = props => <SwitchableDisplay coin='ETH' size='24px' weight={100} showIcon>{props.balance}</SwitchableDisplay>

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
