import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  AssetFilterFields,
  AssetSortFields,
  OwnerQuery,
  SortDirection,
  useOwnerQuery
} from 'generated/graphql.types'

import NftAssetItem from '../../components/NftAssetItem'
import { NftFilterFormValuesType } from '../../NftFilter'

const NftAddressResults: React.FC<Props> = ({
  address,
  formValues,
  page,
  setCollections,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError,
  setNumOfPageItems
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
    requestPolicy: 'network-only',
    variables: {
      filter: [
        {
          field: AssetFilterFields.OwnerAddress,
          value: address.toLowerCase()
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
      setNumOfPageItems(result.data.assets.length)
      setMaxItemsFetched(result.data.assets.length < NFT_ORDER_PAGE_LIMIT)
    }
  }, [result.data?.assets?.length, setMaxItemsFetched, setNumOfPageItems])

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
        return asset ? <NftAssetItem asset={asset} isAddressPage /> : null
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
        safelist_request_status: string
        slug: string
      }[]
    >
  >
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  setNumOfPageItems: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default NftAddressResults
