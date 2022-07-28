// @ts-nocheck

import React from 'react'
import styled from 'styled-components'

const NftViewResults: React.FC<Props> = ({ asset }) => {
  const AssetImg = styled.img`
    border-radius: 18px;
    box-shadow: 0px 0px 8px 0px ${(props) => props.theme.grey200};
    object-fit: cover;
    box-sizing: border-box;
  `
  return (
    <>
      {asset.image_url ? (
        <AssetImg alt='Asset Logo' width='250px' height='250px' src={asset.image_url} />
      ) : (
        <AssetImg
          alt='Asset Logo'
          width='250px'
          height='250px'
          src='https://thumbs.dreamstime.com/b/error-concept-white-background-sign-logo-icon-error-concept-simple-vector-icon-123196424.jpg'
        />
      )}
    </>
  )
}

type Props = {
  asset: {}
}

export default NftViewResults
