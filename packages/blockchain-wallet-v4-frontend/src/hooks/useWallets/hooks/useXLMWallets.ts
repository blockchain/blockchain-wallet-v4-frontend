import { DefaultRootState } from 'react-redux'

import { getData as getXlmAddressData } from 'components/Form/SelectBoxXlmAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

export const createXLMWalletsSelector =
  (): RemoteHookSelector<string, AddressData, DefaultRootState> => (state) =>
    getXlmAddressData(state, {
      excludeLockbox: true,
      includeCustodial: true,
      includeInterest: true
    })

export const useXLMWallets = () =>
  useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createXLMWalletsSelector()
  })
