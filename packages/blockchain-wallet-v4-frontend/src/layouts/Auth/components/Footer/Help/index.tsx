import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const Help = () => (
  <Link
    color='grey400'
    href='https://support.blockchain.com'
    size='16px'
    target='_blank'
    weight={500}
  >
    <FormattedMessage id='scenes.login.need.help' defaultMessage='Need Help?' />
  </Link>
)

export default Help
