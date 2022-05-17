import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { CollectionSortFields, SortDirection, useCollectionsQuery } from 'generated/graphql.types'
import { useMedia } from 'services/styles'

import { GridWrapper } from '../components'
import NftError from '../components/NftError'
import NftGrid from '../components/NftGrid'
import NftGridLoading from '../components/NftGridLoading'
import NftPageLazyLoadWrapper from '../components/NftPageLazyLoadWrapper'
import TraitGridFilters from '../components/TraitGridFilters'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import NftFirehoseResults from './Firehose.results'

const NftFirehose: React.FC<Props> = ({ formActions, formValues }) => {
  const isTablet = useMedia('tablet')
  const [collectionsQuery] = useCollectionsQuery({
    variables: {
      sort: { by: CollectionSortFields.OneDayVolume, direction: SortDirection.Desc }
    }
  })

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )
  const [isFilterOpen, setIsFilterOpen] = useState(!isTablet)

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
  }, [formValues, refreshTrigger])

  const isFetching = isFetchingNextPage

  return (
    <GridWrapper>
      <NftFilter
        collections={collectionsQuery.data?.collections || []}
        formActions={formActions}
        formValues={formValues}
        traits={[]}
        isFilterOpen={isFilterOpen}
        opensea_event_types={[]}
        minMaxPriceFilter
        forSaleFilter
        setIsFilterOpen={setIsFilterOpen}
      />
      <div style={{ width: '100%' }}>
        <TraitGridFilters
          collections={[]}
          tabs={['EXPLORE']}
          activeTab='EXPLORE'
          showSortBy
          setIsFilterOpen={setIsFilterOpen}
          formValues={formValues}
          formActions={formActions}
          setRefreshTrigger={setRefreshTrigger}
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
            <NftGrid fullscreen={!isFilterOpen}>
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
              {isFetching ? <NftGridLoading fullscreen={!isFilterOpen} /> : null}
            </NftGrid>
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
