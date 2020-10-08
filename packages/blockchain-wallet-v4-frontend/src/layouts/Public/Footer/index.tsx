import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

const VersionWrapper = styled.span`
  margin-top: 4px;
  margin-left: 16px;
  margin-right: 16px;
`

// @ts-ignore
const V = APP_VERSION

const Footer = () => (
  <>
    <VersionWrapper>
      <Link
        color='grey400'
        href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases'
        size='14px'
        target='_blank'
        weight={500}
      >
        <FormattedMessage
          id='scenes.login.version'
          defaultMessage='Version {version}'
          values={{
            version: V
          }}
        />
      </Link>
    </VersionWrapper>
    <LinkContainer to='/help'>
      <Link size='16px' weight={500} color='grey400' data-e2e='loginGetHelp'>
        <FormattedMessage
          id='scenes.login.needhelp'
          defaultMessage='Need help?'
        />
      </Link>
    </LinkContainer>
  </>
)

export default Footer
