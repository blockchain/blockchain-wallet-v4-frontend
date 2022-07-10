import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { OwnerNftBalance } from '@core/network/api/nfts/types'

import NftAddressAssetItem from '../../components/NftAddressAssetItem'
import { NftFilterFormValuesType } from '../../NftFilter'

const NftAddressResults: React.FC<Props> = ({ collections }) => {
  return (
    <>
      {collections.nftBalances.balances.map((asset) => {
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
