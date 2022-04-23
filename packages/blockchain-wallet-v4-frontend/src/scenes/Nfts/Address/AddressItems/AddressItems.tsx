import React, { useEffect, useState } from 'react'
import { CombinedError } from 'urql'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { OwnerQuery } from 'generated/graphql'

import { Asset, Grid, LOADING_ITEMS_COUNT } from '../../components'
import { NftFilterFormValuesType } from '../../NftFilter'
import ResultsPage from './AddressItems.results'

const AddressItems: React.FC<Props> = ({ address, collections, formValues, setCollections }) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [address])

  const isFetching = isFetchingNextPage

  return (
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
              <ResultsPage
                page={page}
                formValues={formValues}
                collections={collections}
                setCollections={setCollections}
                setMaxItemsFetched={setMaxItemsFetched}
                key={page}
                address={address}
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
  )
}

type Props = {
  address: string
  collections: OwnerQuery['assets'][0]['collection'][]
  formValues: NftFilterFormValuesType
  setCollections: React.Dispatch<React.SetStateAction<OwnerQuery['assets'][0]['collection'][]>>
}

export default AddressItems
