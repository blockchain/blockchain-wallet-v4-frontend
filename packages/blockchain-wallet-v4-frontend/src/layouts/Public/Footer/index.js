import { Link } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const VersionWrapper = styled.div`
  margin-top: 0.125rem;
  margin-right: 1rem;
`

const Footer = () => (
  <VersionWrapper>
    <Link
      color='white'
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
