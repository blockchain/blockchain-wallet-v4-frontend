import { UseQueryResult } from 'react-query'

import { FindAddressResponse } from '@core/types'

export type UserAddressData = FindAddressResponse

export type UserAddressHook = (
  searchText: string,
  country: string
) => UseQueryResult<UserAddressData>
