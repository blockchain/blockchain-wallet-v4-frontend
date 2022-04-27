import { DefaultRootState } from 'react-redux'

import { getData as getCoinAddressData } from 'components/Form/SelectBoxCoinAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

type CustodialWalletHookProps = { coin: string }

export const createCustodialWalletsSelector =
  ({ coin }: CustodialWalletHookProps): RemoteHookSelector<string, AddressData, DefaultRootState> =>
  (state) =>
    getCoinAddressData(state, {
      coin,
      includeCustodial: true,
      includeInterest: true
    })

export const useCustodialWallets = (props: CustodialWalletHookProps) => {
  return useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createCustodialWalletsSelector(props)
  })
}
