import { DefaultRootState } from 'react-redux'

import { getData as getBtcAddressData } from 'components/Form/SelectBoxBtcAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

export const createBTCWalletsSelector =
  (): RemoteHookSelector<string, AddressData, DefaultRootState> => (state) =>
    getBtcAddressData(state, {
      excludeLockbox: true,
      includeAll: false,
      includeCustodial: true,
      includeInterest: true
    })

export const useBTCWallets = () =>
  useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createBTCWalletsSelector()
  })
