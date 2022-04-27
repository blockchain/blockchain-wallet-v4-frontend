import { DefaultRootState } from 'react-redux'

import { getErc20Data as getErc20AddressData } from 'components/Form/SelectBoxEthAddresses/selectors'

import { RemoteHookSelector } from '../../useRemote'
import { AddressData, WalletsHookData } from '../useWallets.types'
import { mapAddressDataToWalletsData } from '../utils'
import { useCoinRemoteHook } from './useCoinRemoteHook'

type ERC20WalletHookProps = { coin: string }

export const createERC20WalletsSelector =
  ({ coin }: ERC20WalletHookProps): RemoteHookSelector<string, AddressData, DefaultRootState> =>
  (state) =>
    getErc20AddressData(state, {
      coin,
      includeCustodial: true,
      includeInterest: true
    })

export const useERC20Wallets = (props: ERC20WalletHookProps) => {
  return useCoinRemoteHook<string, WalletsHookData[], AddressData>({
    mapper: mapAddressDataToWalletsData,
    selector: createERC20WalletsSelector(props)
  })
}
