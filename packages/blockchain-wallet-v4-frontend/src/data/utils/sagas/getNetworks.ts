import { getContext } from 'typed-redux-saga'

import { makeNetworks } from '../../../api/networks'

export const getNetworks = function* () {
  return yield* getContext<ReturnType<typeof makeNetworks>>('networks')
}
