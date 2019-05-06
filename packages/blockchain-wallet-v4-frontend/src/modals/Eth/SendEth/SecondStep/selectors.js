import { equals, lift, toLower } from 'ramda'
import BigNumber from 'bignumber.js'

import { selectors, model } from 'data'
import { ethFromLabel, erc20FromLabel } from 'services/PaymentHelper'
import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'

const isSubmitting = selectors.form.isSubmitting(model.components.sendEth.FORM)

export const getData = (state, coin) => {
  const isErc20 = !equals(coin, 'ETH')
  const paymentR = selectors.components.sendEth.getPayment(state)
  const ethRatesR = selectors.core.data.eth.getRates(state)
  const currencyR = selectors.core.settings.getCurrency(state)
  const erc20Rates = selectors.core.data.eth
    .getErc20Rates(state, toLower(coin))
    .getOrElse({})

  const transform = (payment, ethRates, currency) => {
    const rates = isErc20 ? erc20Rates : ethRates
    // Convert WEI to base for amount
    const { value: amountStandard } = Exchange.convertCoinToCoin({
      value: payment.amount,
      coin: coin,
      baseToStandard: true
    })
    // Convert WEI to base for fee (ETH)
    const { value: feeStandard } = Exchange.convertCoinToCoin({
      value: payment.fee,
      coin: 'ETH',
      baseToStandard: true
    })
    // Convert ETH or ERC20 amount to Fiat
    const amount = Exchange.convertCoinToFiat(
      amountStandard,
      coin,
      currency,
      rates
    )
    // Fee for ETH or ERC20 txs should always be in ETH
    const fee = Exchange.convertCoinToFiat(
      feeStandard,
      'ETH',
      currency,
      ethRates
    )
    const totalFiat = fiatToString({
      value: Number(amount) + Number(fee),
      unit: { symbol: Exchange.getSymbol(currency) }
    })
    const fromLabel = isErc20
      ? erc20FromLabel(coin, payment, state)
      : ethFromLabel(payment, state)

    return {
      submitting: isSubmitting(state),
      description: payment.description,
      fromAddress: fromLabel,
      toAddress: payment.to.label || payment.to.address,
      amount: payment.amount,
      fee: payment.fee,
      totalCrypto: new BigNumber.sum(payment.amount, payment.fee).toString(),
      totalFiat
    }
  }

  return lift(transform)(paymentR, ethRatesR, currencyR)
}
