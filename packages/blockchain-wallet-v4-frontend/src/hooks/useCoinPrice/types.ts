import { PriceChangeType, TimeRange } from '@core/types'

import { RemoteHookState } from '../useRemote'

export type CoinPriceHookProps = { coin: string; range: keyof typeof TimeRange }

export type CoinPriceHook = (props: CoinPriceHookProps) => RemoteHookState<string, PriceChangeType>
