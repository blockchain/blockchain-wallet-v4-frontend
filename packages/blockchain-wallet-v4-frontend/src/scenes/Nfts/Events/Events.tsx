import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CombinedError } from 'urql'

import { Button, SpinningLoader } from 'blockchain-info-components'
import { TableWrapper } from 'components/Table'
import { EventFilter, EventsQuery, InputMaybe } from 'generated/graphql'

import { Centered, Grid } from '../components'
import GraphqlError from '../components/GraphqlError'
import EventsResults from './Events.results'
import EventsTable from './Events.table'

const Events: React.FC<Props> = ({ filters, isFetchingParent }) => {
  const [events, setEvents] = useState([] as EventsQuery['events'])
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
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
    <>
      <Grid>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <EventsResults
                page={page}
                key={page}
                filters={filters}
                setEvents={setEvents}
                setNextPageFetchError={setNextPageFetchError}
                setIsFetchingNextPage={setIsFetchingNextPage}
              />
            ))
          : null}
      </Grid>
      <TableWrapper>
        {events.length ? <EventsTable events={events} /> : null}
        <Centered>
          <GraphqlError error={errorFetchingNextPage} />
          {isFetchingNextPage || isFetchingParent ? (
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          ) : (
            <Button
              style={{ marginTop: '16px' }}
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
      </TableWrapper>
    </>
  )
}

type Props = {
  address?: never
  filters: InputMaybe<InputMaybe<EventFilter> | InputMaybe<EventFilter>[]> | undefined
  isFetchingParent: boolean
}

export default Events
