import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit'
import { bindActionCreators } from 'redux'
import { CombinedError } from 'urql'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Centered, Grid, GridWrapper, NftBannerWrapper } from '../components'
import GraphqlError from '../components/GraphqlError'
import ResultsPage from './results'

const NftAddress: React.FC<Props> = (props) => {
  const address = props.pathname.split('/nfts/address/')[1]

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
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

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <div
        style={{
          background: `linear-gradient(45deg, #${address.slice(2, 8)}, #FFF)`,
          height: '300px',
          position: 'relative'
        }}
      >
        <NftBannerWrapper>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <Text color='white' size='24px' weight={600}>
              {address}
            </Text>
          </div>
        </NftBannerWrapper>
      </div>
      <GridWrapper>
        <div style={{ width: '100%' }}>
          <Grid>
            {pageVariables.length
              ? pageVariables.map(({ page }) => (
                  <ResultsPage
                    page={page}
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
      </GridWrapper>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  pathname: selectors.router.getPathname(state) as string
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(NftAddress)
