import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import {
  EventFilter,
  EventSortFields,
  EventsQuery,
  InputMaybe,
  SortDirection,
  useEventsQuery
} from 'generated/graphql.types'

const EVENT_PAGE_LIMIT = NFT_ORDER_PAGE_LIMIT / 2

const EventsResults: React.FC<Props> = ({
  filters,
  page,
  setEvents,
  setIsFetchingNextPage,
  setMaxItemsFetched,
  setNextPageFetchError
}) => {
  const [result] = useEventsQuery({
    requestPolicy: 'network-only',
    variables: {
      filter: filters,
      limit: EVENT_PAGE_LIMIT,
      offset: page * EVENT_PAGE_LIMIT,
      sort: { by: EventSortFields.CreatedDate, direction: SortDirection.Desc }
    }
  })

  useEffect(() => {
    if (result.data?.events.length !== undefined) {
      setMaxItemsFetched(result.data.events.length < EVENT_PAGE_LIMIT)
    }
  }, [result.data?.events?.length, setMaxItemsFetched])

  useEffect(() => {
    setNextPageFetchError(result.error)
  }, [result.error])

  useEffect(() => {
    setIsFetchingNextPage(result.fetching)
    if (!result.fetching && result.data) {
      setEvents((events) => events.concat(result.data?.events || []))
    }
  }, [result.fetching])

  return <></>
}

type Props = {
  filters: InputMaybe<InputMaybe<EventFilter> | InputMaybe<EventFilter>[]> | undefined
  page: number
  setEvents: React.Dispatch<React.SetStateAction<EventsQuery['events']>>
  setIsFetchingNextPage: (isFetching: boolean) => void
  setMaxItemsFetched: (maxItemsFetched: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
}

export default EventsResults
