import BigNumber from 'bignumber.js'
import { curry, equals, lift, prop } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { FiatType, RatesType } from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'

const isSubmitting = selectors.form.isSubmitting(model.components.sendEth.FORM)

const ethFromLabel = curry((payment, state) => {
  const { from } = payment
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.eth.getAccountLabel(state, from.address).getOrElse(from.address)
    case ADDRESS_TYPES.LOCKBOX:
      return selectors.core.kvStore.lockbox
        .getLockboxEthAccount(state, from.address)
        .map(prop('label'))
        .getOrElse(from.address)
    default:
      return from.address
  }
})

const erc20FromLabel = curry((coin, payment) => {
  const { from } = payment
  const { coinfig } = window.coins[coin]
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return `${coinfig.displaySymbol} Private Key Wallet`
    default:
      return from.address
  }
})

export const getData = (state, coin) => {
  const isErc20 = !equals(coin, 'ETH')
  const paymentR = selectors.components.sendEth.getPayment(state)
  const ethRatesR = selectors.core.data.coins.getRates('ETH', state)
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
    const fromLabel = isErc20 ? erc20FromLabel(coin, payment) : ethFromLabel(payment, state)

    return {
      amount: payment.amount,
      description: payment.description,
      fee: payment.fee,
      fromAddress: fromLabel,
      fromType: payment.from.type,
      submitting: isSubmitting(state),
      toAddress: payment.to.label || payment.to.address,
      // @ts-ignore
      totalCrypto: new BigNumber.sum(payment.amount, payment.fee).toString(),
      totalFiat
    }
  }

  return lift(transform)(paymentR, ethRatesR, currencyR)
}

export default getData
