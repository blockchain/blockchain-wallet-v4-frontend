import React, { useEffect, useState } from 'react'
import { CombinedError, UseQueryState } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { CollectionsQuery } from 'generated/graphql.types'

import NftError from '../../components/NftError'
import NftGrid from '../../components/NftGrid'
import NftGridLoading from '../../components/NftGridLoading'
import NftNoAssets from '../../components/NftNoAssets'
import { NftFilterFormValuesType } from '../../NftFilter'
import CollectionItemsResults from './CollectionItems.results'

const CollectionItems: React.FC<Props> = ({
  collectionsQuery,
  formValues,
  isFilterOpen,
  refreshTrigger,
  setNumOfResults,
  slug
}) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [numofPageItems, setNumOfPageItems] = useState<number | undefined>(undefined)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )
  const stringifiedForm = JSON.stringify(formValues)

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
  }, [slug, stringifiedForm])

  useEffect(() => {
    refresh()
  }, [refreshTrigger])

  const isFetching = isFetchingNextPage || collectionsQuery.fetching

  if (numofPageItems === 0 && pageVariables.length === 1) {
    return <NftNoAssets />
  }

  return (
    <LazyLoadContainer
      useScroll
      triggerDistance={50}
      onLazyLoad={() =>
        isFetching || maxItemsFetched
          ? null
          : setPageVariables((pages) => [...pages, { page: pages.length + 1 }])
      }
    >
      <NftGrid fullscreen={!isFilterOpen}>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <CollectionItemsResults
                page={page}
                // @ts-ignore
                formValues={formValues}
                key={page}
                slug={slug}
                setNumOfResults={setNumOfResults}
                setNumOfPageItems={setNumOfPageItems}
                setMaxItemsFetched={setMaxItemsFetched}
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
  collectionsQuery: UseQueryState<CollectionsQuery, object>
  formValues: NftFilterFormValuesType
  isFilterOpen: boolean
  refreshTrigger: number
  setNumOfResults: React.Dispatch<React.SetStateAction<number | undefined>>
  slug: string
}

export default CollectionItems
