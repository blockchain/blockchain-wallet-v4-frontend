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
} from 'generated/graphql'

const EventsResults: React.FC<Props> = ({
  filters,
  page,
  setEvents,
  setIsFetchingNextPage,
  setNextPageFetchError
}) => {
  const [result] = useEventsQuery({
    variables: {
      filter: filters,
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT,
      sort: { by: EventSortFields.CreatedDate, direction: SortDirection.Desc }
    }
  })

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
  setNextPageFetchError: (error: CombinedError | undefined) => void
}

export default EventsResults
