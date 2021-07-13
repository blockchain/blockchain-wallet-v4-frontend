import { equals, includes, prop, toLower } from 'ramda'
import { cancel, fork, join, select } from 'redux-saga/effects'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { AccountTypes } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import { MempoolFeeType } from '../swap/types'
import { convertStandardToBase } from './services'

const PROVISIONAL_BTC_SCRIPT = '00000000000000000000000'
const PROVISIONAL_BCH_SCRIPT = '0000000000000000000000000'
export default ({ coreSagas, networks }) => {
  const btcOptions = [networks.btc, PROVISIONAL_BTC_SCRIPT]
  const bchOptions = [networks.bch, PROVISIONAL_BCH_SCRIPT]
  const ethOptions = [networks.eth, null]
  const xlmOptions = [null, null]
  let prevPaymentSource
  let prevPaymentAmount
  let prevPayment
  let paymentTask
  let isSourceErc20

  const calculatePaymentMemo = function * (
    source,
    amount,
    fee: MempoolFeeType = 'priority'
  ) {
    if (
      !equals(source, prevPaymentSource) ||
      !equals(amount, prevPaymentAmount)
    ) {
      const coin = prop('coin', source)
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrElse([])
      isSourceErc20 = includes(coin, erc20List)
      if (paymentTask) cancel(paymentTask)
      paymentTask = yield fork(calculateProvisionalPayment, source, amount, fee)
      prevPayment = yield join(paymentTask)
      prevPaymentSource = source
      prevPaymentAmount = amount
      paymentTask = null
    }
    return prevPayment
  }

  const calculateProvisionalPayment = function * (
    source: AccountTypes,
    amount,
    fee: MempoolFeeType = 'priority'
  ) {
    try {
      const coin = prop('coin', source)
      const addressOrIndex = prop('address', source)
      const addressType = prop('type', source)
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrElse([])
      isSourceErc20 = includes(coin, erc20List)
      const [network, provisionalScript] = isSourceErc20
        ? ethOptions
        : prop(coin, {
            BTC: btcOptions,
            BCH: bchOptions,
            ETH: ethOptions,
            XLM: xlmOptions
          })
      const paymentType = isSourceErc20 ? 'eth' : toLower(coin)
      const payment = yield coreSagas.payment[paymentType]
        .create({ network })
        .chain()
        .init({ isErc20: isSourceErc20, coin })
        .fee(fee)
        .from(addressOrIndex, addressType)
        .done()
      if (isSourceErc20 || includes(coin, ['ETH', 'XLM'])) {
        return payment.amount(convertStandardToBase(coin, amount)).value()
      }

      return (yield payment
        .chain()
        .to(provisionalScript, ADDRESS_TYPES.SCRIPT)
        .amount(parseInt(convertStandardToBase(coin, amount)))
        .build()
        .done()).value()
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
      return {}
    }
  }

  return {
    calculatePaymentMemo,
    calculateProvisionalPayment
  }
}
