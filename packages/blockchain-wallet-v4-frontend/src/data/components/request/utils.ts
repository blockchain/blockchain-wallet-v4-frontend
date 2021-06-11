import { SwapAccountType } from '../swap/types'

export const generateKey = (account: SwapAccountType) =>
  `${account.coin} ${account.label}`
