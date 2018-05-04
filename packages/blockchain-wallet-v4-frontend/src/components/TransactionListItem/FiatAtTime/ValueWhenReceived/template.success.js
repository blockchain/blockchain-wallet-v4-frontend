import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'blockchain-info-components'

export const Success = props => (
  <Text size='12px' weight={200}>
    {props.fiatAtTime}
  </Text>
)

Success.propTypes = {
  fiatAtTime: PropTypes.string.isRequired
}

Success.defaultProps = {
  fiatAtTime: 'N/A'
}

export default Success
