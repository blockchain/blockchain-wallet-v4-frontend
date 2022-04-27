import { DefaultRootState } from 'react-redux'

import { getData as getBchAddressData } from 'components/Form/SelectBoxBchAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

export const createBCHWalletsSelector =
  (): RemoteHookSelector<string, AddressData, DefaultRootState> => (state) =>
    getBchAddressData(state, {
      coin: 'BCH',
      excludeLockbox: true,
      includeCustodial: true,
      includeInterest: true
    })

export const useBCHWallets = () =>
  useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createBCHWalletsSelector()
  })
