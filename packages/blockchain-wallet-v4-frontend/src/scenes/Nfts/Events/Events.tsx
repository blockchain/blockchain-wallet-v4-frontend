import React, { useEffect, useState } from 'react'
import { CombinedError } from 'urql'

import { RawOrder } from '@core/network/api/nfts/types'
import { SpinningLoader } from 'blockchain-info-components'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { TableWrapper } from 'components/Table'
import { EventFilter, EventsQuery, InputMaybe } from 'generated/graphql.types'

import { Centered } from '../components'
import NftError from '../components/NftError'
import EventsResults from './Events.results'
import EventsTable from './Events.table'

const Events: React.FC<Props> = ({ bidsAndOffers, columns, filters, isFetchingParent }) => {
  const [events, setEvents] = useState([] as EventsQuery['events'])
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [maxItemsFetched, setMaxItemsFetched] = useState(false)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setEvents([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [filters])

  return (
    <LazyLoadContainer
      triggerDistance={50}
      onLazyLoad={() =>
        isFetchingNextPage || maxItemsFetched || errorFetchingNextPage
          ? null
          : setPageVariables((pages) => [...pages, { page: pages.length + 1 }])
      }
    >
      {pageVariables.length
        ? pageVariables.map(({ page }) => (
            <EventsResults
              page={page}
              key={page}
              filters={filters}
              setEvents={setEvents}
              setMaxItemsFetched={setMaxItemsFetched}
              setNextPageFetchError={setNextPageFetchError}
              setIsFetchingNextPage={setIsFetchingNextPage}
            />
          ))
        : null}
      <TableWrapper height='auto'>
        {events.length ? (
          <EventsTable
            columns={columns || ['event_type', 'item', 'price', 'from', 'to', 'date']}
            events={events}
            bidsAndOffers={bidsAndOffers}
          />
        ) : null}
        <Centered>
          {isFetchingNextPage || isFetchingParent ? (
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          ) : null}
        </Centered>
      </TableWrapper>
      {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
    </LazyLoadContainer>
  )
}

type Props = {
  address?: never
  bidsAndOffers?: RawOrder[]
  columns?: ('event_type' | 'item' | 'price' | 'from' | 'to' | 'date')[]
  filters: InputMaybe<InputMaybe<EventFilter> | InputMaybe<EventFilter>[]> | undefined
  isFetchingParent: boolean
}

export default React.memo(Events)
