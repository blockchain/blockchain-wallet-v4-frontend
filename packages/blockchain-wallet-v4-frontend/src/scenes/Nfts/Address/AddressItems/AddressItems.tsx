import React, { useEffect, useState } from 'react'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { OwnerQuery } from 'generated/graphql.types'

import { Grid } from '../../components'
import NftError from '../../components/NftError'
import NftGridLoading from '../../components/NftGridLoading'
import NftPageLazyLoadWrapper from '../../components/NftPageLazyLoadWrapper'
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
    <NftPageLazyLoadWrapper>
      <LazyLoadContainer
        triggerDistance={50}
        onLazyLoad={() =>
          isFetching || maxItemsFetched || errorFetchingNextPage
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
          {isFetching ? <NftGridLoading /> : null}
        </Grid>
        {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
      </LazyLoadContainer>
    </NftPageLazyLoadWrapper>
  )
}

type Props = {
  address: string
  collections: OwnerQuery['assets'][0]['collection'][]
  formValues: NftFilterFormValuesType
  setCollections: React.Dispatch<React.SetStateAction<OwnerQuery['assets'][0]['collection'][]>>
}

export default AddressItems
