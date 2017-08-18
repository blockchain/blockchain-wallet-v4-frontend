import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link } from '../Links'
import appleStore from '../Images/img/app-store-badge.svg'
import googlePlay from '../Images/img/google-play-badge.png'

const BaseBadge = styled.img`
  display: inline-block;
  height: 40px;
 `
const selectProperties = type => {
  switch (type) {
    case 'applestore': return { image: appleStore, url: 'https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309' }
    case 'googleplay': return { image: googlePlay, url: 'https://play.google.com/store/apps/details?id=piuk.blockchain.android' }
    default: return { image: '', url: '#' }
  }
}

const Badge = ({ ...props, children }) => {
  const { image, url } = selectProperties(props.type)

  return url
    ? <Link href={url} target='_blank'><BaseBadge src={image} /></Link>
    : <BaseBadge src={image} />
}

Badge.propTypes = {
  type: PropTypes.oneOf(['applestore', 'googleplay']).isRequired
}

export default Badge
