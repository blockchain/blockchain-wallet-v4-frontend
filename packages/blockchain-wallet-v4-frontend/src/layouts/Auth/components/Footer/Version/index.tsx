import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'

const Version = () => (
  <Link
    color='grey400'
    href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases'
    size='16px'
    target='_blank'
    weight={500}
  >
    <FormattedMessage
      id='scenes.login.version'
      defaultMessage='Version {version}'
      values={{ version: window.APP_VERSION }}
    />
  </Link>
)

export default Version
