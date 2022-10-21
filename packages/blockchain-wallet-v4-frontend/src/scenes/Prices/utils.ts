import { ascend, descend, prop, sortWith } from 'ramda'

import { CoinfigType } from '@core/redux/walletOptions/types'

export const sortCoins = <
  T extends {
    marketCap: number
    name: string
    products: CoinfigType['products']
  }
>(
  coins: T[]
) =>
  sortWith<T>(
    [
      descend((coin) => coin.products.includes('CustodialWalletBalance')),
      descend(prop('marketCap')),
      ascend(prop('name'))
    ],
    coins
  )
