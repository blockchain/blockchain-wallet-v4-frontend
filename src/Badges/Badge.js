import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link } from '../Links'
import appleStore from '../Images/img/app-store-badge.svg'
import googlePlay from '../Images/img/google-play-badge.png'

const BaseBadge = styled.img`
  height: 40px;
 `
const Badge = ({ ...props, children }) => {
  let image, url

  switch (props.type) {
    case 'applestore':
      image = appleStore
      url = 'https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309'
      break
    case 'googleplay':
      image = googlePlay
      url = 'https://play.google.com/store/apps/details?id=piuk.blockchain.android'
      break
    default:
      url = ''
  }

  return url
    ? <BaseBadge src={image} />
    : (
      <Link src={url} target='_blank'>
        <BaseBadge src={image} />
      </Link>
    )
}

Badge.propTypes = {
  type: PropTypes.oneOf(['applestore', 'googleplay']).isRequired,
  url: PropTypes.string
}

Badge.defaultProps = {
  url: '#'
}

export default Badge
