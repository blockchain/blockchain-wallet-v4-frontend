import React, { useEffect, useState } from 'react'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { OwnerQuery } from 'generated/graphql.types'

import NftError from '../../components/NftError'
import NftGrid from '../../components/NftGrid'
import NftGridLoading from '../../components/NftGridLoading'
import NftNoOwnedAssets from '../../components/NftNoOwnedAssets'
import { NftFilterFormValuesType } from '../../NftFilter'
import ResultsPage from './AddressItems.results'

const AddressItems: React.FC<Props> = ({
  address,
  collections,
  formValues,
  isFilterOpen,
  refreshTrigger,
  setCollections
}) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [numofPageItems, setNumOfPageItems] = useState<number | undefined>(undefined)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  const refresh = () => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setMaxItemsFetched(false)
    setNumOfPageItems(undefined)
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }

  useEffect(() => {
    refresh()
  }, [address, refreshTrigger])

  const isFetching = isFetchingNextPage

  if (numofPageItems === 0 && pageVariables.length === 1) {
    return <NftNoOwnedAssets />
  }

  return (
    <LazyLoadContainer
      useScroll
      triggerDistance={50}
      onLazyLoad={() =>
        isFetching || maxItemsFetched || errorFetchingNextPage
          ? null
          : setPageVariables((pages) => [...pages, { page: pages.length + 1 }])
      }
    >
      <NftGrid fullscreen={!isFilterOpen}>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <ResultsPage
                page={page}
                formValues={formValues}
                collections={collections}
                setCollections={setCollections}
                setMaxItemsFetched={setMaxItemsFetched}
                key={page}
                address={address}
                setNumOfPageItems={setNumOfPageItems}
                setNextPageFetchError={setNextPageFetchError}
                setIsFetchingNextPage={setIsFetchingNextPage}
              />
            ))
          : null}
        {isFetching ? <NftGridLoading fullscreen={!isFilterOpen} /> : null}
      </NftGrid>
      {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
    </LazyLoadContainer>
  )
}

type Props = {
  address: string
  collections: OwnerQuery['assets'][0]['collection'][]
  formValues: NftFilterFormValuesType
  isFilterOpen: boolean
  refreshTrigger: number
  setCollections: React.Dispatch<React.SetStateAction<OwnerQuery['assets'][0]['collection'][]>>
}

export default AddressItems
