import { RemoteDataType } from '@core/types'

export type RemoteHookState<ERROR, RESULT> = {
  data?: RESULT
  error?: ERROR
  hasData: boolean
  hasError: boolean
  isLoading: boolean
  isNotAsked: boolean
}

export type RemoteHookSelector<ERROR, RESULT, STATE> = (
  state: STATE
) => RemoteDataType<ERROR, RESULT>
