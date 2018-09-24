import React from 'react'
import PropTypes from 'prop-types'

import { Link, Icon, TooltipHost } from 'blockchain-info-components'

const RefreshIcon = props => (
  <TooltipHost id='refresh.tooltip'>
    <Link
      size='14px'
      weight={300}
      color='white'
      uppercase
      onClick={props.handleRefresh}
    >
      <Icon name='refresh' color='white' cursor />
    </Link>
  </TooltipHost>
)

RefreshIcon.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default RefreshIcon
