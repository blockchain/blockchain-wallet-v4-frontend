import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { Button, Text } from 'blockchain-info-components'
import {
  AssetFilterFields,
  AssetSortFields,
  OwnerQuery,
  SortDirection,
  useOwnerQuery
} from 'generated/graphql'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetImageContainer,
  PriceCTA
} from '../../components'
import NftError from '../../components/NftError'
import { NftFilterFormValuesType } from '../../NftFilter'

const NftAddressResults: React.FC<Props> = ({
  address,
  formValues,
  page,
  setCollections,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError
}) => {
  const activeCollections = formValues?.collection
    ? [{ field: AssetFilterFields.CollectionSlug, value: formValues.collection }]
    : []

  const sort = formValues?.sortBy
    ? {
        by: formValues.sortBy.split('-')[0] as AssetSortFields,
        direction: formValues.sortBy.split('-')[1] as SortDirection
      }
    : null

  const [result] = useOwnerQuery({
    variables: {
      filter: [
        {
          field: AssetFilterFields.OwnerAddress,
          value: address
        },
        ...activeCollections
      ],
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort
    }
  })

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
  }, [result.fetching])

  useEffect(() => {
    if (result.data?.assets.length !== undefined) {
      setMaxItemsFetched(result.data.assets.length < NFT_ORDER_PAGE_LIMIT)
    }
  }, [result.data?.assets?.length, setMaxItemsFetched])

  useEffect(() => {
    setCollections((collections) => {
      const newAssetCollections = result.data?.assets.filter(({ collection: newCollection }) => {
        if (collections.find((collection) => collection.slug === newCollection.slug)) {
          return false
        }

        return true
      })

      const newCollections = collections.concat(
        newAssetCollections?.map(({ collection }) => collection) ?? []
      )

      return [...new Map(newCollections.map((item) => [item.slug, item])).values()]
    })
  }, [result.data])

  return (
    <>
      {result.data?.assets.map((asset) => {
        if (!asset) return null
        return (
          <Asset key={asset?.token_id}>
            <LinkContainer to={`/nfts/asset/${asset.contract?.address}/${asset.token_id}`}>
              <AssetImageContainer background={`url(${asset?.image_url?.replace(/=s\d*/, '')})`} />
            </LinkContainer>
            <AssetDetails>
              <div>
                <AssetCollection>
                  <Text style={{ whiteSpace: 'nowrap' }} size='14px' color='grey800' weight={600}>
                    {asset?.collection?.name}
                  </Text>
                </AssetCollection>
                <Text style={{ marginTop: '4px' }} size='16px' color='black' weight={600}>
                  {asset?.name}
                </Text>
              </div>

              <PriceCTA>
                <LinkContainer to={`/nfts/asset/${asset.contract?.address}/${asset.token_id}`}>
                  <Button data-e2e='nftAssetPage' nature='primary' small>
                    <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
                  </Button>
                </LinkContainer>
              </PriceCTA>
            </AssetDetails>
          </Asset>
        )
      })}
    </>
  )
}

type Props = {
  address: string
  collections: OwnerQuery['assets'][0]['collection'][]
  formValues: NftFilterFormValuesType
  page: number
  setCollections: React.Dispatch<
    React.SetStateAction<
      {
        __typename?: 'Collection' | undefined
        image_url?: string | null | undefined
        name: string
        slug: string
      }[]
    >
  >
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
}

export default NftAddressResults
