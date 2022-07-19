import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { OwnerNftBalance } from '@core/network/api/nfts/types'

import NftAddressAssetItem from '../../components/NftAddressAssetItem'
import { NftFilterFormValuesType } from '../../NftFilter'

// useEffect(() => {
//   nftsActions.fetchNftOwnerAssets({ defaultEthAddr: address, network: 'ETH' })
// }, [])

// useEffect(() => {
//   if (result.data?.assets.length !== undefined) {
//     setNumOfPageItems(result.data.assets.length)
//     setMaxItemsFetched(result.data.assets.length < NFT_ORDER_PAGE_LIMIT)
//   }
// }, [result.data?.assets?.length, setMaxItemsFetched, setNumOfPageItems])

const NftAddressResults: React.FC<Props> = ({ collections }) => {
  return (
    <>
      {collections.assets.map((asset) => {
        return asset ? <NftAddressAssetItem asset={asset} /> : null
      })}
    </>
  )
}

type Props = {
  address: string
  collections: OwnerNftBalance
  formValues: NftFilterFormValuesType
  page: number
  setCollections: React.Dispatch<React.SetStateAction<{}>>
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  setNumOfPageItems: React.Dispatch<React.SetStateAction<number | undefined>>
}

export default NftAddressResults
