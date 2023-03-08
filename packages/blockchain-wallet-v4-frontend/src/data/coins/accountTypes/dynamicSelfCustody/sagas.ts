import { call, select } from 'typed-redux-saga'

import { getPubKey } from '@core/redux/data/self-custody/sagas'
import { CoinType } from '@core/types'
import { selectors } from 'data'
import { getApi } from 'data/utils/sagas/getApi'
import { promptForSecondPassword } from 'services/sagas'

export const getNextReceiveAddress = function* (coin: CoinType) {
  const api = yield* getApi()

  if (coin === 'STX') {
    const password = (yield* call(promptForSecondPassword)) as string
    const pubKeys = yield* call(getPubKey, coin, password)
    const { results } = yield* call(api.deriveAddress, coin, pubKeys)
    const result = results.find(({ default: isDefault }) => isDefault)
    return { address: result?.address }
  }
  const address: string | undefined = selectors.core.kvStore.eth
    .getDefaultAddress(yield* select())
    .getOrFail(`Failed to get ETH receive address`)

  return { address }
}
