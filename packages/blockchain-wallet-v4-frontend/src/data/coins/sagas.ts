import { call } from 'typed-redux-saga'

import { CoinType, PaymentValue, RemoteDataType } from '@core/types'

import {
  CoinAccountTypeEnum,
  NonCustodialAccountTypeClass
} from './accountTypes/accountTypes.classes'
import { CustodialAccountType } from './accountTypes/accountTypes.custodial'
import { DynamicSelfCustodyAccountType } from './accountTypes/accountTypes.dynamicSelfCustody'
import { ERC20AccountType } from './accountTypes/accountTypes.erc20'
import { NonCustodialAccountType } from './accountTypes/accountTypes.nonCustodial'
import { getKey } from './selectors'

export default ({ api, coreSagas, networks }) => {
  const accounts = {
    CUSTODIAL: new CustodialAccountType(api, networks),
    DYNAMIC_SELF_CUSTODY: new DynamicSelfCustodyAccountType(api, networks),
    ERC20: new ERC20AccountType(api, networks),
    NON_CUSTODIAL: new NonCustodialAccountType(api, networks)
  }
  // gets the default account/address for requested coin
  const getDefaultAccountForCoin = function* (coin: CoinType) {
    const accountType = getKey(coin)
    const defaultAccountR = yield (
      accounts[accountType] as NonCustodialAccountTypeClass
    ).getDefaultAccount(coin)

    return defaultAccountR.getOrFail('Failed to find default account')
  }

  // gets the next receive address for requested coin
  // account based currencies will just return the account address
  const getNextReceiveAddressForCoin = function* (
    coin: CoinType,
    coinAccountType: CoinAccountTypeEnum,
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
    const accountType = getKey(coin)
    return yield (
      accounts[accountType] as NonCustodialAccountTypeClass
    ).getOrUpdateProvisionalPayment(coreSagas, paymentR, coin)
  }

  return {
    getDefaultAccountForCoin,
    getNextReceiveAddressForCoin,
    getOrUpdateProvisionalPaymentForCoin
  }
}
