import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const ReserveLearnLink = props => (
  <Link size='12px' weight={300}>
    <FormattedMessage
      id='modals.sendxlm.reservelearn'
      defaultMessage='Learn more'
    />
  </Link>
)

export default ReserveLearnLink
