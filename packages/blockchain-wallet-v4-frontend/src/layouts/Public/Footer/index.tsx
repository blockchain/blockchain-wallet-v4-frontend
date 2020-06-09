import { Link } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const VersionWrapper = styled.span`
  margin-top: 4px;
  margin-left: 16px;
`

// @ts-ignore
const V = APP_VERSION

const Footer = () => (
  <VersionWrapper>
    <Link
      color='whiteFade600'
      href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases'
      size='14px'
      target='_blank'
      weight={500}
    >
      Version {V}
    </Link>
  </VersionWrapper>
)

export default Footer
