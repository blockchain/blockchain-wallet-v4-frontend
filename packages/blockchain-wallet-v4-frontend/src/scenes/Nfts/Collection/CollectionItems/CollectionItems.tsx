import React, { useEffect, useState } from 'react'
import { CombinedError, UseQueryState } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { CollectionsQuery } from 'generated/graphql.types'

import { Grid } from '../../components'
import NftError from '../../components/NftError'
import NftGridLoading from '../../components/NftGridLoading'
import NftPageLazyLoadWrapper from '../../components/NftPageLazyLoadWrapper'
import { NftFilterFormValuesType } from '../../NftFilter'
import CollectionItemsResults from './CollectionItems.results'

const CollectionItems: React.FC<Props> = ({
  collectionsQuery,
  formValues,
  refreshTrigger,
  setNumOfResults,
  slug
}) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  const refresh = () => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setMaxItemsFetched(false)
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }

  useEffect(() => {
    refresh()
  }, [slug, formValues])

  useEffect(() => {
    refresh()
  }, [refreshTrigger])

  const isFetching = isFetchingNextPage || collectionsQuery.fetching

  return (
    <NftPageLazyLoadWrapper>
      <LazyLoadContainer
        triggerDistance={50}
        onLazyLoad={() =>
          isFetching || maxItemsFetched
            ? null
            : setPageVariables((pages) => [...pages, { page: pages.length + 1 }])
        }
      >
        <Grid>
          {pageVariables.length
            ? pageVariables.map(({ page }) => (
                <CollectionItemsResults
                  page={page}
                  // @ts-ignore
                  formValues={formValues}
                  key={page}
                  slug={slug}
                  setNumOfResults={setNumOfResults}
                  setMaxItemsFetched={setMaxItemsFetched}
                  setNextPageFetchError={setNextPageFetchError}
                  setIsFetchingNextPage={setIsFetchingNextPage}
                />
              ))
            : null}
          {isFetching ? <NftGridLoading /> : null}
        </Grid>
        {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
      </LazyLoadContainer>
    </NftPageLazyLoadWrapper>
  )
}

type Props = {
  collectionsQuery: UseQueryState<CollectionsQuery, object>
  formValues: NftFilterFormValuesType
  refreshTrigger: number
  setNumOfResults: React.Dispatch<React.SetStateAction<number | undefined>>
  slug: string
}

export default CollectionItems
