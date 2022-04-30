import React, { useEffect, useState } from 'react'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'

import { Grid } from '../components'
import NftError from '../components/NftError'
import NftGridLoading from '../components/NftGridLoading'
import NftPageLazyLoadWrapper from '../components/NftPageLazyLoadWrapper'
import { NftFilterFormValuesType } from '../NftFilter'
import NftFirehoseResults from './Firehose.results'

const NftFirehose: React.FC<Props> = ({ formValues, slug }) => {
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

  const isFetching = isFetchingNextPage

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
                <NftFirehoseResults
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
          {isFetching ? <NftGridLoading /> : null}
        </Grid>
        {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
      </LazyLoadContainer>
    </NftPageLazyLoadWrapper>
  )
}

type Props = {
  formValues: NftFilterFormValuesType
  slug: string
}

export default NftFirehose
