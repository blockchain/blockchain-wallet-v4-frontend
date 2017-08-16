import React from 'react'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import googlePlayBadge from 'img/google-play-badge.png'

const GooglePlayBadge = styled.img.attrs({
  src: googlePlayBadge
})`
  height: 40px;
`

const GooglePlay = () => (
  <Link href='https://play.google.com/store/apps/details?id=piuk.blockchain.android' target='_blank'>
    <GooglePlayBadge />
  </Link>
)

export default GooglePlay
