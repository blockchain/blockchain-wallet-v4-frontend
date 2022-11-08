import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'data/rootReducer'

import { NetworkType } from './types'

const getConfig = (state: RootState) => state.networkConfig.config

export const getEvmCompatibleCoins = createSelector([getConfig], (configR) =>
  configR
    .map((config) =>
      config.networks
        .filter((network) => network.type === NetworkType.EVM)
        .map((network) => network.nativeAsset)
    )
    .getOrElse([])
)
