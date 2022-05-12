import BigNumber from 'bignumber.js'

import { displayCoinToCoin } from '@core/exchange'
import { GasDataI, NftAsset } from '@core/network/api/nfts/types'

export const getTotalFees = (asset: NftAsset, val: GasDataI) => {
  return `${String(
    Number(asset.collection?.dev_seller_fee_basis_points) / 100 +
      Number(asset.asset_contract?.opensea_seller_fee_basis_points) / 100
  )}% (${displayCoinToCoin({
    coin: 'ETH',
    value: new BigNumber(val.totalFees).multipliedBy(val.gasPrice).toString()
  })})`
}
