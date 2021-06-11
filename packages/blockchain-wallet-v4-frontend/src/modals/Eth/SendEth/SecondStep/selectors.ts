import BigNumber from 'bignumber.js'
import { curry, equals, lift, prop, toLower } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { FiatType } from 'blockchain-wallet-v4/src/types'
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

const erc20FromLabel = curry((coin, payment, state) => {
  const { from } = payment
  switch (from.type) {
    case ADDRESS_TYPES.ACCOUNT:
      return selectors.core.kvStore.eth
        .getErc20AccountLabel(state, toLower(coin))
        .getOrElse(from.address)
    default:
      return from.address
  }
})

export const getData = (state, coin) => {
  const isErc20 = !equals(coin, 'ETH')
  const paymentR = selectors.components.sendEth.getPayment(state)
  const ethRatesR = selectors.core.data.eth.getRates(state)
  const currencyR = selectors.core.settings.getCurrency(state)
  const erc20Rates = selectors.core.data.eth.getErc20Rates(state, toLower(coin)).getOrElse({})

  const transform = (payment, ethRates, currency: FiatType) => {
    const rates = isErc20 ? erc20Rates : ethRates
    // Convert WEI to base for amount
    const { value: amountStandard } = Exchange.convertCoinToCoin({
      baseToStandard: true,
      coin,
      value: payment.amount
    })
    // Convert WEI to base for fee (ETH)
    const { value: feeStandard } = Exchange.convertCoinToCoin({
      baseToStandard: true,
      coin: 'ETH',
      value: payment.fee
    })
    // Convert ETH or ERC20 amount to Fiat
    const amount = Exchange.convertCoinToFiat(amountStandard, coin, currency, rates)
    // Fee for ETH or ERC20 txs should always be in ETH
    const fee = Exchange.convertCoinToFiat(
      feeStandard,
      'ETH',
      currency,
      isErc20 && payment.from.type === 'CUSTODIAL' ? erc20Rates : ethRates
    )
    const totalFiat = fiatToString({
      unit: currency,
      value: Number(amount) + Number(fee)
    })
    const fromLabel = isErc20 ? erc20FromLabel(coin, payment, state) : ethFromLabel(payment, state)

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
