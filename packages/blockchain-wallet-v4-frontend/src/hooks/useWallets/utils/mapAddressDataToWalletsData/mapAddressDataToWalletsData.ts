import { flatten } from 'ramda'

import { AddressData, WalletsHookData } from '../../useWallets.types'

export const mapAddressDataToWalletsData = (data: AddressData): WalletsHookData[] => {
  if (!data) return data

  const options = flatten(data.data.map((datum) => datum.options))

  return options.map((option) => option.value)
}
