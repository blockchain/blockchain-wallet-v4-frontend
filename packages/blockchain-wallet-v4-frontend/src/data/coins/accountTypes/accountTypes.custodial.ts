import { call } from '@redux-saga/core/effects'
import { lift } from 'ramda'

import { APIType } from '@core/network/api'
import { BSBalanceType, CoinType, ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { RequestExtrasType, SwapAccountType } from 'data/types'

import { generateTradingAccount } from '../utils'
import { AccountTypeClass } from './accountTypes.classes'

export class CustodialAccountType implements AccountTypeClass {
  api: APIType

  networks: any

  constructor(api: APIType, networks: any) {
    this.api = api
    this.networks = networks
  }

  *getNextReceiveAddress(coin: CoinType) {
    const custodial: ReturnType<typeof this.api.getBSPaymentAccount> = yield call(
      this.api.getBSPaymentAccount,
      coin
    )
    let { address } = custodial
    const extras = {} as RequestExtrasType
    if (window.coins[coin].coinfig.type.isMemoBased && address.split(':')[1]) {
      // eslint-disable-next-line prefer-destructuring
      extras.Memo = address.split(':')[1]
      // eslint-disable-next-line prefer-destructuring
      address = address.split(':')[0]
    }

    return { address, extras }
  }

  getAccounts = createDeepEqualSelector(
    [
      (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
      (state, ownProps) => ownProps // selector config
    ],
    (sbBalanceR, ownProps) => {
      const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
        const { coin } = ownProps
        const { coinfig } = window.coins[coin]
        let accounts: SwapAccountType[] = []

        // add trading accounts if requested
        if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
          accounts = accounts.concat(
            generateTradingAccount(coin as CoinType, sbBalance as BSBalanceType)
          )
        }

        return accounts
      }

      return lift(transform)(sbBalanceR)
    }
  )
}
