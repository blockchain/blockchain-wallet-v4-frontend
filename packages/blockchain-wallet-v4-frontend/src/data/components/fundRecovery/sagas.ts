import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'
import { HDAccountList, Wallet } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import * as A from './actions'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  // const logLocation = 'components/fundRecovery/sagas'

  const searchChainForFunds = function* (action: ReturnType<typeof A.searchChain>) {
    const { payload } = action
    const { accountIndex, coin, derivationType } = payload
    try {
      yield put(A.searchChainLoading(accountIndex, coin, derivationType))

      if (coin === 'BCH') {
        const wallet = selectors.core.wallet.getWallet(yield select())
        const accounts = Wallet.selectHDAccounts(wallet)
        const account = HDAccountList.selectAccount(accountIndex, accounts)
        const badDerivation = account.derivations.find((d) => d.type === derivationType)
        const badXpub = badDerivation.xpub
        const { unspent_outputs }: UnspentResponseType = yield call(api.getBchUnspents, [badXpub])

        yield put(A.searchChainSuccess(accountIndex, coin, derivationType, unspent_outputs))
      } else {
        yield put(
          A.searchChainFailure(
            accountIndex,
            coin,
            derivationType,
            `No recovery method for ${coin}.`
          )
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.searchChainFailure(accountIndex, coin, derivationType, error))
    }
  }

  return {
    searchChainForFunds
  }
}
