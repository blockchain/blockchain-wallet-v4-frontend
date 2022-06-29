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
            return (
              <MoreAssetsListItem key={asset.token_id}>
                <CustomLink
                  onClick={() => {
                    window.scrollTo({ behavior: 'smooth', top: 0 })
                  }}
                  to={link}
                  style={{
                    border: `1px solid ${colors.grey000}`,
                    borderRadius: '10%',
                    borderWidth: '1px',
                    boxSizing: 'border-box',
                    justifyContent: 'center',
                    margin: '1em',
                    padding: '10px'
                  }}
                >
                  <div>
                    <CollectionName>
                      {asset.collection.image_url ? (
                        <NftCollectionImage
                          alt='Dapp Logo'
                          src={asset.collection?.image_url || ''}
                          isVerified={asset.collection.safelist_request_status === 'verified'}
                        />
                      ) : null}
                      <div style={{ paddingLeft: '8px' }}>{asset.collection?.name}</div>
                    </CollectionName>
                    <img
                      alt='Asset Logo'
                      width='100%'
                      height='auto'
                      style={{
                        borderRadius: '10%',
                        boxSizing: 'border-box',
                        marginBottom: '0.5rem',
                        marginTop: '1em'
                      }}
                      src={asset.image_url || ''}
                    />
                    <Text style={{ textAlign: 'center' }} size='14px' weight={600} capitalize>
                      {asset.name || `#${asset.token_id}`}
                    </Text>
                  </div>
                </CustomLink>
              </MoreAssetsListItem>
            )
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
