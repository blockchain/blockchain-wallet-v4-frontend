import React, { useEffect, useMemo } from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import {
  AssetFilterFields,
  AssetQuery,
  ChainOperators,
  FilterOperators,
  useAssetsQuery
} from 'generated/graphql.types'
import { media } from 'services/styles'

import { CollectionName, CustomLink } from '.'

const MoreAssets = styled.div`
  width: 100%;
  ${media.tablet`
    padding-right: 1em;
    padding-left: 1em;
  `}
`

const MoreAssetsList = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

const MoreAssetsListItem = styled.div`
  width: 25%;
  ${media.tablet`width: 50%;`}
`

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

  return (
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
          <CustomLink
            onClick={() => {
              window.scrollTo({ behavior: 'smooth', top: 0 })
            }}
            to={`/nfts/collection/${asset.collection?.slug}`}
          >
            <Button data-e2e='goToCollection' nature='empty-blue' padding='1em'>
              See All
            </Button>
          </CustomLink>
        </div>
        <MoreAssetsList>
          {assets?.data?.assets?.length
            ? assets?.data?.assets?.map((asset) => {
                const link = `/nfts/asset/${asset.contract?.address}/${asset.token_id}`
                return (
                  <MoreAssetsListItem key={asset.token_id}>
                    <CustomLink
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
                            <img
                              alt='Dapp Logo'
                              height='30px'
                              width='auto'
                              style={{
                                borderRadius: '50%',
                                paddingRight: '0.5em'
                              }}
                              src={asset.collection?.image_url || ''}
                            />
                          ) : null}
                          <div>{asset.collection?.name}</div>
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
                          {asset.name || asset.token_id}
                        </Text>
                      </div>
                    </CustomLink>
                  </MoreAssetsListItem>
                )
              })
            : null}
        </MoreAssetsList>
      </MoreAssets>
    </div>
  )
}

type Props = {
  asset: AssetQuery['assets'][0]
}

export default AssetMoreItems
