import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { convertCoinToCoin } from '@core/exchange'
import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  AssetFilter,
  AssetFilterFields,
  AssetSortFields,
  FilterOperators,
  InputMaybe,
  SortDirection,
  useAssetsQuery
} from 'generated/graphql.types'

import NftAssetItem from '../../components/NftAssetItem'
import { NftFilterFormValuesType } from '../../NftFilter'
import { getTraitFilters } from '../../utils/NftUtils'

const CollectionItemsResults: React.FC<Props> = ({
  formValues,
  page,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError,
  setNumOfPageItems,
  setNumOfResults,
  slug
}) => {
  const filter: InputMaybe<InputMaybe<AssetFilter> | InputMaybe<AssetFilter>[]> = [
    { field: AssetFilterFields.CollectionSlug, value: slug }
  ]

  const traits = getTraitFilters(formValues)

  const traitFilter = traits?.reduce((acc, trait) => {
    Object.keys((formValues || {})[trait]).map((value) => {
      if ((formValues || {})[trait][value]) {
        acc.push({ trait_type: trait, value })
      }

      return acc
    })

    return acc
  }, [] as { trait_type: string; value: string }[])

  const sort = formValues?.sortBy
    ? {
        by: formValues.sortBy.split('-')[0] as AssetSortFields,
        direction: formValues.sortBy.split('-')[1] as SortDirection
      }
    : null

  if (formValues?.max) {
    filter.push({
      field: AssetFilterFields.Price,
      operator: FilterOperators.Lt,
      value: convertCoinToCoin({ baseToStandard: false, coin: 'ETH', value: formValues?.max })
    })
  }

  if (formValues?.min) {
    filter.push({
      field: AssetFilterFields.Price,
      operator: FilterOperators.Gt,
      value: convertCoinToCoin({ baseToStandard: false, coin: 'ETH', value: formValues?.min })
    })
  }

  const [result] = useAssetsQuery({
    requestPolicy: 'network-only',
    variables: {
      filter,
      forSale: Boolean(formValues?.forSale),
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort,
      traitFilter
    }
  })

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
    if (!result.fetching && result.data?.assets[0]) {
      setNumOfResults(result.data.assets[0].results || undefined)
    }
  }, [result.fetching])

  useEffect(() => {
    if (result.data?.assets.length !== undefined) {
      setNumOfPageItems(result.data.assets.length)
      setMaxItemsFetched(result.data.assets.length < NFT_ORDER_PAGE_LIMIT)
    }
  }, [result.data?.assets?.length, setMaxItemsFetched, setNumOfPageItems])

  return (
    <>
      {result?.data?.assets?.map((asset) => {
        return asset ? <NftAssetItem asset={asset} /> : null
      })}
    </>
  )
}

type Props = {
  formValues: NftFilterFormValuesType
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  setNumOfPageItems: React.Dispatch<React.SetStateAction<number | undefined>>
  setNumOfResults: React.Dispatch<React.SetStateAction<number | undefined>>
  slug: string
}

export default CollectionItemsResults
