import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Grid, GridWrapper } from '../components'
import NftError from '../components/NftError'
import NftGridLoading from '../components/NftGridLoading'
import NftPageLazyLoadWrapper from '../components/NftPageLazyLoadWrapper'
import TraitGridFilters from '../components/TraitGridFilters'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import NftFirehoseResults from './Firehose.results'

const NftFirehose: React.FC<Props> = ({ formActions, formValues }) => {
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
  }, [formValues])

  const isFetching = isFetchingNextPage

  return (
    <GridWrapper>
      <NftFilter
        collections={[]}
        formActions={formActions}
        formValues={formValues}
        traits={[]}
        opensea_event_types={[]}
        minMaxPriceFilter
        forSaleFilter
      />
      <div style={{ width: '100%' }}>
        <TraitGridFilters
          tabs={['EXPLORE']}
          activeTab='EXPLORE'
          showSortBy
          formValues={formValues}
          formActions={formActions}
          collections={[]}
          setActiveTab={() => null}
        />
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
      </div>
    </GridWrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'nftFilter' }),
  connector
)

export default enhance(NftFirehose) as React.FC<{}>
