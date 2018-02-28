import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Link, Icon} from 'blockchain-info-components'


const Refresh = (props) => {
  const { handleRefresh } = props

  return (
    <Link size='14px' weight={300} color='white' uppercase onClick={handleRefresh}>
      <Icon name='refresh' color='white'/>
    </Link>
  )
}

Refresh.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default Refresh
