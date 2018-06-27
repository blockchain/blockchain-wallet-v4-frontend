import React from 'react'
import PropTypes from 'prop-types'

import { Link, Icon } from 'blockchain-info-components'

const RefreshIcon = props => (
  <Link size='14px' weight={300} color='white' uppercase onClick={props.handleRefresh}>
    <Icon name='refresh-filled' color='white' cursor/>
  </Link>
)

RefreshIcon.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default RefreshIcon
