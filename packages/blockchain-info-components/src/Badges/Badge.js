import React from 'react'
import PropTypes from 'prop-types'

import { Image } from '../Images'
import { Link } from '../Links'

const Badge = ({ ...props }) => {
  const { size, type } = props
  switch (type) {
    case 'applestore':
      return (
        <Link
          href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309'
          target='_blank'
        >
          <Image name='apple-app-store-badge' height={size || '48px'} />
        </Link>
      )
    case 'googleplay':
      return (
        <Link
          href='https://play.google.com/store/apps/details?id=piuk.blockchain.android'
          target='_blank'
        >
          <Image name='google-play-badge' height={size || '48px'} />
        </Link>
      )
    default:
      return <div />
  }
}

Badge.propTypes = {
  size: PropTypes.string,
  type: PropTypes.oneOf(['applestore', 'googleplay']).isRequired
}

export default Badge
