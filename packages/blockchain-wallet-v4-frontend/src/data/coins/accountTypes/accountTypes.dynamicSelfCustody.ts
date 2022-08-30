import { call, select } from '@redux-saga/core/effects'
import { lift } from 'ramda'

import { APIType } from '@core/network/api'
import { getPubKey } from '@core/redux/data/self-custody/sagas'
import { BSBalanceType, CoinType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { SwapAccountType } from 'data/types'
import { promptForSecondPassword } from 'services/sagas'

import { generateSelfCustodyAccount, generateTradingAccount } from '../utils'
import { AccountTypeClass } from './accountTypes.classes'

export class DynamicSelfCustodyAccountType implements AccountTypeClass {
  api: APIType

  networks: any

  constructor(api: APIType, networks: any) {
    this.api = api
    this.networks = networks
  }

  *getNextReceiveAddress(coin: CoinType) {
    if (coin === 'STX') {
      const password = yield call(promptForSecondPassword)
      const pubKeys = yield call(getPubKey, password)
      const { results }: ReturnType<typeof this.api.deriveAddress> = yield call(
        this.api.deriveAddress,
        coin,
        pubKeys
      )
      const result = results.find(({ default: isDefault }) => isDefault)
      return { address: result?.address }
    }
    const address = selectors.core.kvStore.eth
      .getDefaultAddress(yield select())
      .getOrFail(`Failed to get ETH receive address`)

    return { address }
  }

  getAccounts = createDeepEqualSelector(
    [
      (state, ownProps) => selectors.balances.getCoinNonCustodialBalance(ownProps.coin)(state),
      (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
      (state, ownProps) => ownProps // selector config
    ],
    (balanceR, sbBalanceR, ownProps) => {
      const { coin } = ownProps
      const { coinfig } = window.coins[coin]
      let accounts: SwapAccountType[] = []

      const transform = (balance, sbBalance) => {
        accounts = accounts.concat(generateSelfCustodyAccount(coin, balance))

        // add trading accounts if requested
        if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
          accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
        }
        return accounts
      }

      return lift(transform)(balanceR, sbBalanceR)
    }
  )
}
