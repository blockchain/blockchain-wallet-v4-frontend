import { ReactNode } from 'react'

import { CoinType } from '@core/types'

type CoinAboutSectionHookProps = { coin: CoinType }

type CoinAboutSectionHook = (props: CoinAboutSectionHookProps) => [ReactNode]

export type { CoinAboutSectionHook, CoinAboutSectionHookProps }
