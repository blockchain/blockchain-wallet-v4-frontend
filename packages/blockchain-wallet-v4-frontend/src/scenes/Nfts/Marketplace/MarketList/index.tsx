import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { Button, SpinningLoader } from 'blockchain-info-components'

import { Props as OwnProps } from '../..'
import { Grid } from '../../components'
import Error from './error'
import ResultsPage from './results'

const Centered = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  gap: 8px;
`

const MarketList: React.FC<Props> = ({ defaultEthAddr, nftsActions, slug }) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<CombinedError | undefined>(undefined)

  useEffect(() => {
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 1000)
  }, [slug])

  return (
    <Grid>
      <div>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <ResultsPage
                page={page}
                key={page}
                slug={slug}
                defaultEthAddr={defaultEthAddr}
                setError={setError}
                nftsActions={nftsActions}
                setIsFetching={setIsFetching}
              />
            ))
          : null}
      </div>
      <Centered>
        <Error error={error} />
        {isFetching ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : (
          <Button
            onClick={() => setPageVariables((pages) => [...pages, { page: pages.length + 1 }])}
            nature='primary'
            data-e2e='loadMoreNfts'
          >
            {error ? (
              <FormattedMessage id='copy.retry' defaultMessage='Retry' />
            ) : (
              <FormattedMessage id='copy.load_more' defaultMessage='Load More' />
            )}
          </Button>
        )}
      </Centered>
    </Grid>
  )
}

type Props = { defaultEthAddr: string; nftsActions: OwnProps['nftsActions']; slug: string }

export default MarketList
