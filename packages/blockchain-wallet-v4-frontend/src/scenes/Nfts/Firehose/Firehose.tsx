import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import { CombinedError } from 'urql'

import LazyLoadContainer from 'components/LazyLoadContainer'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  CollectionFilterFields,
  CollectionSortFields,
  SortDirection,
  useTrendingCollectionsQuery
} from 'generated/graphql.types'
import { useMedia } from 'services/styles'

import { GridWrapper } from '../components'
import NftError from '../components/NftError'
import NftGrid from '../components/NftGrid'
import NftGridLoading from '../components/NftGridLoading'
import NftNoAssets from '../components/NftNoAssets'
import TraitGridFilters from '../components/TraitGridFilters'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import NftFirehoseResults from './Firehose.results'

const NftFirehose: React.FC<Props> = ({ formActions, formValues, isTestnet }) => {
  const [collectionsQuery] = useTrendingCollectionsQuery({
    variables: {
      filter: {
        field: CollectionFilterFields.Network,
        value: 'ethereum'
      },
      sort: { by: CollectionSortFields.OneDayVolume, direction: SortDirection.Desc }
    }
  })

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const isTablet = useMedia('tablet')
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [numofPageItems, setNumOfPageItems] = useState<number | undefined>(undefined)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )
  const [isFilterOpen, setIsFilterOpen] = useState(!isTablet)
  const stringifiedForm = JSON.stringify(formValues)

  const refresh = () => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setNumOfPageItems(undefined)
    setMaxItemsFetched(false)
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }

  useEffect(() => {
    refresh()
  }, [refreshTrigger, stringifiedForm])

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
        verifiedFilter
      />
      <div style={{ width: '100%' }}>
        <TraitGridFilters
          collections={collectionsQuery.data?.collections || []}
          tabs={['EXPLORE']}
          activeTab='EXPLORE'
          showSortBy
          setIsFilterOpen={setIsFilterOpen}
          formValues={formValues}
          formActions={formActions}
          setRefreshTrigger={setRefreshTrigger}
          setActiveTab={() => null}
        />
        {numofPageItems === 0 && pageVariables.length === 1 ? (
          <NftNoAssets />
        ) : (
          <LazyLoadContainer
            useScroll
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
                      isTestnet={isTestnet}
                      setMaxItemsFetched={setMaxItemsFetched}
                      setNextPageFetchError={setNextPageFetchError}
                      setNumOfPageItems={setNumOfPageItems}
                      setIsFetchingNextPage={setIsFetchingNextPage}
                    />
                  ))
                : null}
              {isFetching ? <NftGridLoading fullscreen={!isFilterOpen} /> : null}
            </NftGrid>
            {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
          </LazyLoadContainer>
        )}
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

type Props = ConnectedProps<typeof connector> & { isTestnet: boolean }

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: 'nftFilter'
  }),
  connector
)

export default enhance(NftFirehose) as React.FC<{}>
