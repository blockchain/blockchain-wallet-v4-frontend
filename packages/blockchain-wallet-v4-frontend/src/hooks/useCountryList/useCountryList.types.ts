import { UseQueryResult } from 'react-query'

import { CountryScopeType } from '@core/types'
import { CountryType, StateType } from 'data/types'

type CountryListApiData = {
  countries: Array<CountryType>
}
type USStatesListApiData = {
  states: Array<StateType>
}

type CountryListHookProps = { scope?: CountryScopeType }

type CountryListHook = (props: CountryListHookProps) => UseQueryResult<CountryListApiData>

type CountryUSStateHook = () => UseQueryResult<USStatesListApiData>

export type { CountryListApiData, CountryListHook, CountryUSStateHook, USStatesListApiData }
