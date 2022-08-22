import { head, lift } from 'ramda'
import { select } from 'redux-saga/effects'

import { coreSelectors } from '@core'
import { APIType } from '@core/network/api'
import { BSBalanceType, ExtractSuccess, PaymentValue } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/types'

import { generateTradingAccount } from '../utils'
import { NonCustodialAccountTypeClass } from './accountTypes.classes'

export class ERC20AccountType implements NonCustodialAccountTypeClass {
  api: APIType

  networks: any

  constructor(api: APIType, networks: any) {
    this.api = api
    this.networks = networks
  }

  *getNextReceiveAddress(coin: string) {
    const address = selectors.core.kvStore.eth
      .getDefaultAddress(yield select())
      .getOrFail(`Failed to get ${coin} receive address.`)

    return { address }
  }

  *getDefaultAccount(coin: string) {
    const erc20AccountR = yield select(selectors.core.common.eth.getErc20AccountBalances, coin)
    return erc20AccountR.map(head)
  }

  *getOrUpdateProvisionalPayment(coreSagas, networks, paymentR) {
    return yield coreSagas.payment.eth.create({
      network: networks.eth,
      payment: paymentR.getOrElse(<PaymentValue>{})
    })
  }

  getAccounts = createDeepEqualSelector(
    [
      coreSelectors.kvStore.eth.getDefaultAddress,
      (state, { coin }) => selectors.balances.getCoinNonCustodialBalance(coin)(state), // non-custodial metadata
      (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
      (state, ownProps) => ownProps // selector config
    ],
    (ethAddressR, erc20BalanceR, sbBalanceR, ownProps) => {
      const transform = (
        ethAddress,
        erc20Balance,
        sbBalance: ExtractSuccess<typeof sbBalanceR>
      ) => {
        const { coin } = ownProps
        const { coinfig } = window.coins[coin]
        let accounts: SwapAccountType[] = []

        // add non-custodial accounts if requested
        if (ownProps?.nonCustodialAccounts) {
          accounts = accounts.concat([
            {
              address: ethAddress,
              balance: erc20Balance,
              baseCoin: 'ETH',
              coin,
              label: 'Private Key Wallet',
              type: SwapBaseCounterTypes.ACCOUNT
            }
          ])
        }

        // add trading accounts if requested
        if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
          accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
        }
        return accounts
      }

      return lift(transform)(ethAddressR, erc20BalanceR, sbBalanceR)
    }
  )
}
