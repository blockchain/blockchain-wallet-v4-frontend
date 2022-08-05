import BigNumber from 'bignumber.js'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { equals, lift } from 'ramda'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { FiatType, RatesType } from '@core/types'
import { selectors } from 'data'

export const getData = (state, coin) => {
  const isErc20 = !equals(coin, AvailableCoins.ETH)
  const paymentR = selectors.components.sendEth.getPayment(state)
  const ethRatesR = selectors.core.data.coins.getRates(coin, state)
  const currencyR = selectors.core.settings.getCurrency(state)
  const erc20Rates = selectors.core.data.coins.getRates(coin, state).getOrElse({} as RatesType)

  const transform = (payment, ethRates, currency: FiatType) => {
    const rates = isErc20 ? erc20Rates : ethRates

    // Convert WEI to base for amount
    const amountStandard = Exchange.convertCoinToCoin({
      baseToStandard: true,
      coin,
      value: payment.amount
    })
    const amount = Exchange.convertCoinToFiat({
      coin,
      currency,
      isStandard: true,
      rates,
      value: amountStandard
    })

    // Fee for ETH or ERC20 txs should always be in ETH
    const useErc20 = isErc20 && payment.from.type === 'CUSTODIAL'
    const fee = Exchange.convertCoinToFiat({
      coin: useErc20 ? coin : 'ETH',
      currency,
      rates: useErc20 ? erc20Rates : ethRates,
      value: payment.fee
    })

    const totalFiat = fiatToString({
      unit: currency,
      value: Number(amount) + Number(fee)
    })

    return {
      amount: payment.amount,
      description: payment.description,
      fee: payment.fee,
      feeInGwei: payment.feeInGwei,
      from: payment.from,
      minFee: payment.fees.limits.min,
      priorityFee: payment.fees.priority,
      regularFee: payment.fees.regular,
      toAddress: payment.to.label || payment.to.address,
      totalCrypto: BigNumber.sum(payment.amount, payment.fee).toString(),
      totalFiat
    }
  }

  return lift(transform)(paymentR, ethRatesR, currencyR)
}

export default getData
