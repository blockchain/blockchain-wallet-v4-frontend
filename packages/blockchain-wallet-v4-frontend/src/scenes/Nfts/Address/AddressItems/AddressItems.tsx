import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CombinedError } from 'urql'

import { Button, SpinningLoader } from 'blockchain-info-components'
import { OwnerQuery } from 'generated/graphql'

import { Centered, Grid } from '../../components'
import GraphqlError from '../../components/GraphqlError'
import { NftFilterFormValuesType } from '../../NftFilter'
import ResultsPage from './AddressItems.results'

const AddressItems: React.FC<Props> = ({ address, collections, formValues, setCollections }) => {
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [address])

  return (
    <div>
      <Grid>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <ResultsPage
                page={page}
                formValues={formValues}
                collections={collections}
                setCollections={setCollections}
                key={page}
                address={address}
                setNextPageFetchError={setNextPageFetchError}
                setIsFetchingNextPage={setIsFetchingNextPage}
              />
            ))
          : null}
      </Grid>
      <Centered>
        <GraphqlError error={errorFetchingNextPage} />
        {isFetchingNextPage ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : (
          <Button
            onClick={() => setPageVariables((pages) => [...pages, { page: pages.length + 1 }])}
            nature='primary'
            data-e2e='loadMoreNfts'
          >
            {errorFetchingNextPage ? (
              <FormattedMessage id='copy.retry' defaultMessage='Retry' />
            ) : (
              <FormattedMessage id='copy.load_more' defaultMessage='Load More' />
            )}
          </Button>
        )}
      </Centered>
    </div>
  )
}

type Props = {
  address: string
  collections: OwnerQuery['assets'][0]['collection'][]
  formValues: NftFilterFormValuesType
  setCollections: React.Dispatch<React.SetStateAction<OwnerQuery['assets'][0]['collection'][]>>
}

export default AddressItems
