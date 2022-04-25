import React, { useEffect, useState } from 'react'
import { CombinedError, UseQueryState } from 'urql'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { CollectionsQuery } from 'generated/graphql'

import { Asset, Grid, LOADING_ITEMS_COUNT } from '../../components'
import { NftFilterFormValuesType } from '../../NftFilter'
import CollectionItemsResults from './CollectionItems.results'

const CollectionItems: React.FC<Props> = ({ collectionsQuery, formValues, slug }) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setMaxItemsFetched(false)
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [slug, formValues])

  const isFetching = isFetchingNextPage || collectionsQuery.fetching

  return (
    <>
      <LazyLoadContainer
        triggerDistance={300}
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
                  setMaxItemsFetched={setMaxItemsFetched}
                  setNextPageFetchError={setNextPageFetchError}
                  setIsFetchingNextPage={setIsFetchingNextPage}
                />
              ))
            : null}
          {isFetching ? (
            <>
              {[...Array(LOADING_ITEMS_COUNT)].map((e, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Asset key={i}>
                  <SkeletonRectangle width='100%' height='285px' />
                  <div style={{ minHeight: '120px', padding: '12px 8px' }}>
                    <Flex
                      style={{ height: '100%' }}
                      justifyContent='space-between'
                      flexDirection='column'
                    >
                      <div>
                        <SkeletonRectangle height='24px' width='100px' />
                        <div style={{ marginTop: '4px' }} />
                        <SkeletonRectangle height='30px' width='120px' />
                        <div style={{ marginTop: '4px' }} />
                      </div>
                      <SkeletonRectangle height='42px' width='100%' />
                    </Flex>
                  </div>
                </Asset>
              ))}
            </>
          ) : null}
        </Grid>
      </LazyLoadContainer>
    </>
  )
}

type Props = {
  collectionsQuery: UseQueryState<CollectionsQuery, object>
  formValues: NftFilterFormValuesType
  slug: string
}

export default CollectionItems
