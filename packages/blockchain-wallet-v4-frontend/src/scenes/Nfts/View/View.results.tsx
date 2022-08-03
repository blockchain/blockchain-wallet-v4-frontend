import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { NftAsset } from '@core/network/api/nfts/types'
import { Image, Text } from 'blockchain-info-components'

const NftViewResults: React.FC<Props> = ({ asset }) => {
  const AssetImg = styled.img`
    border-radius: 18px;
    object-fit: cover;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 12px 0px ${(props) => props.theme.grey200};
    }
  `
  const EmptyState = styled.div`
    border-radius: 18px;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    object-fit: cover;
    box-sizing: border-box;
    background: rgb(192, 217, 252);
    background: radial-gradient(
      circle,
      rgba(192, 217, 252, 1) 0%,
      rgba(255, 255, 255, 1) 100%,
      rgba(194, 218, 252, 1) 100%,
      rgba(12, 108, 242, 1) 100%
    );
  `
  const Center = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  `
  return (
    <>
      {asset.image_url ? (
        <LinkContainer to={`/nfts/assets/${asset.asset_contract?.address}/${asset.token_id}`}>
          <AssetImg alt='Asset Logo' width='200px' height='200px' src={asset.image_url} />
        </LinkContainer>
      ) : (
        <EmptyState>
          <Center>
            <Image width='75px' height='auto' name='nft-purchase' />
            <Text color='grey900' size='12px' weight={500}>
              Image Preview Unavailable
            </Text>
          </Center>
        </EmptyState>
      )}
    </>
  )
}

type Props = {
  asset: NftAsset
}

export default NftViewResults
