import React, { useMemo } from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import {
  AssetFilterFields,
  AssetQuery,
  ChainOperators,
  FilterOperators,
  useAssetsQuery
} from 'generated/graphql.types'
import { useMedia } from 'services/styles'

import NftAssetItem from '../../components/NftAssetItem'
import NftGrid from '../../components/NftGrid'
import { CustomLink, MoreAssets, MoreAssetsWrapper } from '.'

const AssetMoreItems: React.FC<Props> = ({ asset }) => {
  const limit = 4
  const offset = useMemo(
    () => Math.max(0, Math.floor(Math.random() * (asset?.collection?.total_supply || 0) - limit)),
    [asset]
  )
  const [assets] = useAssetsQuery({
    variables: {
      filter: [
        { field: AssetFilterFields.CollectionSlug, value: asset.collection.slug },
        {
          chain_operator: ChainOperators.And,
          field: AssetFilterFields.TokenId,
          operator: FilterOperators.Neq,
          value: asset.token_id
        }
      ],
      limit,
      offset
    }
  })
  const Wrapper = styled.div`
    background: ${(props) => props.theme.greyFade000};
    box-shadow: inset 0px 8px 16px rgba(60, 106, 172, 0.08);
    display: flex;
    width: 100%;
  `

  const isMobile = useMedia('mobile')

  return assets?.data?.assets?.length ? (
    <Wrapper>
      <MoreAssets>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Text color='grey700' weight={600} capitalize>
            More from this collection
          </Text>
          {!isMobile ? (
            <CustomLink to={`/nfts/collection/${asset.collection?.slug}`}>
              <Button data-e2e='goToCollection' nature='empty-blue' padding='1em'>
                See All
              </Button>
            </CustomLink>
          ) : null}
        </div>
        <MoreAssetsWrapper>
          <NftGrid moreAssetsPage fullscreen>
            {assets?.data?.assets?.map((asset) => {
              return (
                <div key={asset.token_id}>
                  <NftAssetItem asset={asset} />
                </div>
              )
            })}
          </NftGrid>
        </MoreAssetsWrapper>
        {isMobile ? (
          <CustomLink to={`/nfts/collection/${asset.collection?.slug}`}>
            <Button fullwidth data-e2e='goToCollection' nature='empty-blue' padding='1em'>
              See All
            </Button>
          </CustomLink>
        ) : null}
      </MoreAssets>
    </Wrapper>
  ) : null
}

type Props = {
  asset: AssetQuery['assets'][0]
}

export default AssetMoreItems
