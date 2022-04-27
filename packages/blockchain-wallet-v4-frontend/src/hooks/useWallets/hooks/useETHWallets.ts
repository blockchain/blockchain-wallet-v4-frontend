import { DefaultRootState } from 'react-redux'

import { getEthData as getEthAddressData } from 'components/Form/SelectBoxEthAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

export const createETHWalletsSelector =
  (): RemoteHookSelector<string, AddressData, DefaultRootState> => (state) =>
    getEthAddressData(state, {
      excludeLockbox: true,
      includeCustodial: true,
      includeInterest: true
    })

export const useETHWallets = () =>
  useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createETHWalletsSelector()
  })
