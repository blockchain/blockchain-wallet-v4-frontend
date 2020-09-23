import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import React from 'react'

export const Success = props => (
  <Text size='14px' weight={400} data-e2e='valueAtTimeOfTransaction'>
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
