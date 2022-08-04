import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { NftAsset } from '@core/network/api/nfts/types'
import { Image, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

const NftViewResults: React.FC<Props> = (props) => {
  const { asset, nftsActions } = props
  const AssetImg = styled.img`
    border-radius: 18px;
    object-fit: cover;
    box-sizing: border-box;
    cursor: pointer;
    width: 175px;
    height: 175px;
    &:hover {
      box-shadow: 0px 0px 12px 0px ${(props) => props.theme.grey200};
    }
    ${media.laptop`
      width: 100%;
      height: 175px;
    `};
  `
  const EmptyState = styled.div`
    border-radius: 18px;
    width: 175px;
    height: 175px;
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
    ${media.laptop`
      width: 100%;
      height: 175px;
    `};
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
          <AssetImg
            onClick={() => nftsActions.setViewOrder({ viewOrder: asset })}
            alt='Asset Logo'
            src={asset.image_url}
          />
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

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  asset: NftAsset
}

export default connector(NftViewResults)
