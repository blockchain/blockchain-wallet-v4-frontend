import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const NotAsked = props => (
  <Link size='12px' weight={200} onClick={props.handleClick}>
    <FormattedMessage id='components.transactionlistitem.fiatattime.notasked.view' defaultMessage='view' />
  </Link>
)

NotAsked.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default NotAsked
