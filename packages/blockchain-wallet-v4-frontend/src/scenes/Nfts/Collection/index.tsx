import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { Button, SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Grid } from '../components'
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

const NftsCollection: React.FC<Props> = ({ defaultEthAddr, nftsActions, ...rest }) => {
  const { slug } = rest.computedMatch.params
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

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default connector(NftsCollection)
