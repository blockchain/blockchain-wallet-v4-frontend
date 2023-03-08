import { call } from 'typed-redux-saga'

import { CoinType, PaymentValue, RemoteDataType } from '@core/types'

import { AccountType } from './accountTypes/accountTypes'
import { sagas as custodialSagas } from './accountTypes/custodial'
import { sagas as dynamicSelfCustodySagas } from './accountTypes/dynamicSelfCustody'
import { sagas as erc20Sagas } from './accountTypes/erc20'
import { sagas as nonCustodialSagas } from './accountTypes/nonCustodial'
import { getNonCustodialKey } from './selectors'

export default ({ coreSagas }) => {
  const accounts = {
    [AccountType.CUSTODIAL]: custodialSagas,
    [AccountType.DYNAMIC_SELF_CUSTODY]: dynamicSelfCustodySagas,
    [AccountType.ERC20]: erc20Sagas,
    [AccountType.NON_CUSTODIAL]: nonCustodialSagas
  }
  // gets the default account/address for requested coin
  const getDefaultAccountForCoin = function* (coin: CoinType) {
    const accountType = getNonCustodialKey(coin)
    const defaultAccountR = yield accounts[accountType].getDefaultAccount(coin)

    return defaultAccountR.getOrFail('Failed to find default account')
  }

  // gets the next receive address for requested coin
  // account based currencies will just return the account address
  const getNextReceiveAddressForCoin = function* (
    coin: CoinType,
    coinAccountType: AccountType,
    index?: number
  ) {
    return yield* call(accounts[coinAccountType].getNextReceiveAddress, coin, index)
  }

  // gets or updates a provisional payment for a coin
  // provisional payments are mutable payment objects used to build a transaction
  // over an extended period of time (e.g. as user goes through interest/swap/sell flows)
  const getOrUpdateProvisionalPaymentForCoin = function* (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue | undefined>
  ) {
    const accountType = getNonCustodialKey(coin)
    return yield accounts[accountType].getOrUpdateProvisionalPayment(coreSagas, paymentR, coin)
  }

  return {
    getDefaultAccountForCoin,
    getNextReceiveAddressForCoin,
    getOrUpdateProvisionalPaymentForCoin
  }
}
