import React, { useEffect } from 'react'
import { CombinedError } from 'urql'

import { NFT_ORDER_PAGE_LIMIT } from '@core/network/api/nfts'
import { EventFilterFields, EventsQuery, useEventsQuery } from 'generated/graphql'

import { NftFilterFormValuesType } from '../../NftFilter'

const CollectionEventsResults: React.FC<Props> = ({
  page,
  setEvents,
  setIsFetchingNextPage,
  setNextPageFetchError,
  slug
}) => {
  const [result] = useEventsQuery({
    variables: {
      filter: [{ field: EventFilterFields.CollectionSlug, value: slug }],
      limit: NFT_ORDER_PAGE_LIMIT,
      offset: page * NFT_ORDER_PAGE_LIMIT
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
  formValues: NftFilterFormValuesType
  page: number
  setEvents: React.Dispatch<React.SetStateAction<EventsQuery['events']>>
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default CollectionEventsResults
