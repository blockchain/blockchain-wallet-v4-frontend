import React, { useMemo } from 'react'
import { colors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import {
  AssetFilterFields,
  AssetQuery,
  ChainOperators,
  FilterOperators,
  useAssetsQuery
} from 'generated/graphql.types'

import NftAssetItem from '../../components/NftAssetItem'
import NftCollectionImage from '../../components/NftCollectionImage'
import { CollectionName, CustomLink, MoreAssets, MoreAssetsList, MoreAssetsListItem } from '.'

const AssetMoreItems: React.FC<Props> = ({ asset }) => {
  const limit = 4
  const offset = useMemo(
    () => Math.max(0, Math.floor(Math.random() * (asset?.collection?.total_supply || 20) - limit)),
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

  return assets?.data?.assets?.length ? (
    <div style={{ display: 'flex', width: '100%' }}>
      <MoreAssets>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '40px'
          }}
        >
          <Text color='grey700' weight={600} capitalize>
            More from this collection
          </Text>
          <CustomLink to={`/nfts/collection/${asset.collection?.slug}`}>
            <Button data-e2e='goToCollection' nature='empty-blue' padding='1em'>
              See All
            </Button>
          </CustomLink>
        </div>
        <MoreAssetsList>
          {assets?.data?.assets?.map((asset) => {
            const link = `/nfts/assets/${asset.contract?.address}/${asset.token_id}`
            return <NftAssetItem asset={asset} key={asset.token_id} />
          })}
        </MoreAssetsList>
      </MoreAssets>
    </div>
  ) : null
}

type Props = {
  asset: AssetQuery['assets'][0]
}

export default AssetMoreItems
