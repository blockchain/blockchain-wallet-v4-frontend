import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { SpinningLoader } from 'blockchain-info-components'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { EventFilter, EventsQuery, InputMaybe } from 'generated/graphql.types'

import { NftTableWrapper } from '../Asset/components'
import { Centered } from '../components'
import NftError from '../components/NftError'
import EventsResults from './Events.results'
import EventsTable from './Events.table'

const StyledLazyLoadContainer = styled(LazyLoadContainer)`
  position: relative;
  overflow: initial;
`

const Events: React.FC<Props> = ({ columns, filters, isFetchingParent, noBorder }) => {
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
    <StyledLazyLoadContainer
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
      <NftTableWrapper height='auto'>
        {events.length ? (
          <EventsTable
            columns={columns || ['event_type', 'item', 'price', 'from', 'to', 'date']}
            events={events}
            noBorder={noBorder}
          />
        ) : (
          <Centered style={{ padding: '12px' }}>
            {isFetchingNextPage || isFetchingParent ? (
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            ) : null}
          </Centered>
        )}
      </NftTableWrapper>
      {errorFetchingNextPage ? <NftError error={errorFetchingNextPage} /> : null}
    </StyledLazyLoadContainer>
  )
}

type Props = {
  address?: never
  columns?: ('event_type' | 'item' | 'price' | 'from' | 'to' | 'date')[]
  filters: InputMaybe<InputMaybe<EventFilter> | InputMaybe<EventFilter>[]> | undefined
  isFetchingParent: boolean
  noBorder?: boolean
}

export default React.memo(Events)
