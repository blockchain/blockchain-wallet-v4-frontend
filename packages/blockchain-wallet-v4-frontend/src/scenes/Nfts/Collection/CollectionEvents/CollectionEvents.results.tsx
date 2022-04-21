import React from 'react'
import { CombinedError } from 'urql'

import { NftFilterFormValuesType } from '../../NftFilter'

const CollectionEventsResults: React.FC<Props> = () => {
  return <div>here</div>
}

type Props = {
  formValues: NftFilterFormValuesType
  page: number
  setIsFetchingNextPage: (isFetching: boolean) => void
  setNextPageFetchError: (error: CombinedError | undefined) => void
  slug: string
}

export default CollectionEventsResults
