import React from 'react'
import styled from 'styled-components'

import { Link } from 'components/generic/Link'
import appleStoreBadge from 'img/app-store-badge.svg'

const AppleStoreBadge = styled.img.attrs({
  src: appleStoreBadge
})`
  height: 40px;
`

const AppleStore = () => (
  <Link href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309' target='_blank'>
    <AppleStoreBadge />
  </Link>
)

export default AppleStore
