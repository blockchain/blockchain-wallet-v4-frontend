import { CoinfigType } from '@core/types'

export type CoinConfigHookProps = { coin: string }

export type CoinConfigHook = (props: CoinConfigHookProps) => {
  data?: CoinfigType
  isLoading: boolean
}
