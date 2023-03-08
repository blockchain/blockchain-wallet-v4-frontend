import { SwapAccountType, SwapBaseCounterTypes } from 'data/types'

export const makeAccountStub = (): SwapAccountType => ({
  accountIndex: 1,
  address: '0x0921390129031',
  balance: '100000',
  baseCoin: 'USD',
  coin: 'BTC',
  label: 'Test Account',
  type: SwapBaseCounterTypes.ACCOUNT
})
