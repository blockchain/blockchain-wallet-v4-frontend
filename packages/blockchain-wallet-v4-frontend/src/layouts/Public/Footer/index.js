import { Link } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const VersionWrapper = styled.span`
  margin-top: 0.125rem;
  margin-left: 1.5rem;
`

const Footer = () => (
  <VersionWrapper>
    <Link
      color='whiteFade600'
      href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases'
      size='14px'
      target='_blank'
      weight={500}
    >
      Version {APP_VERSION}
    </Link>
  </VersionWrapper>
)

export default Footer
