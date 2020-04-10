import * as S from './selectors'
import { AccountTypes } from 'core/types'
import { actions, actionTypes, selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { always, equals, head, includes, prop, toLower } from 'ramda'
import { call, cancel, fork, join, put, select, take } from 'redux-saga/effects'
import { convertStandardToBase } from './services'
import { CREATE_ACCOUNT_ERROR, NO_ACCOUNT_ERROR, RESERVE_ERROR } from './model'
import { Exchange } from 'blockchain-wallet-v4/src'
import BigNumber from 'bignumber.js'

const PROVISIONAL_BTC_SCRIPT = '00000000000000000000000'
const PROVISIONAL_BCH_SCRIPT = '0000000000000000000000000'
export default ({ coreSagas, networks }) => {
  const logLocation = 'components/exchange/sagas.utils'
  const btcOptions = [networks.btc, PROVISIONAL_BTC_SCRIPT]
  const bchOptions = [networks.bch, PROVISIONAL_BCH_SCRIPT]
  const ethOptions = [networks.eth, null]
  const xlmOptions = [null, null]
  let prevPaymentSource
  let prevPaymentAmount
  let prevPayment
  let paymentTask
  let isSourceErc20

  const calculatePaymentMemo = function * (source, amount) {
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
      paymentTask = yield fork(calculateProvisionalPayment, source, amount)
      prevPayment = yield join(paymentTask)
      prevPaymentSource = source
      prevPaymentAmount = amount
      paymentTask = null
    }
    return prevPayment
  }

  const calculateProvisionalPayment = function * (source: AccountTypes, amount) {
    try {
      const coin = prop('coin', source)
      const addressOrIndex = prop('address', source)
      const addressType = prop('type', source)
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
        .fee('priority')
        .from(addressOrIndex, addressType)
        .done()
      if (isSourceErc20 || includes(coin, ['ETH', 'XLM'])) {
        return payment.value()
      }

      return (yield payment
        .chain()
        .to(provisionalScript, ADDRESS_TYPES.SCRIPT)
        .amount(parseInt(convertStandardToBase(coin, amount)))
        .build()
        .done()).value()
    } catch (e) {
      return {}
    }
  }

  const createPayment = function * (
    coin,
    sourceAddressOrIndex,
    targetAddress,
    addressType,
    amount,
    fees,
    memo
  ) {
    let payment
    switch (coin) {
      case 'BCH':
        payment = coreSagas.payment.bch
          .create({ network: networks.bch })
          .chain()
          .amount(parseInt(amount))
        break
      case 'BTC':
        payment = coreSagas.payment.btc
          .create({ network: networks.btc })
          .chain()
          .amount(parseInt(amount))
        break
      case 'PAX':
      case 'ETH':
        payment = coreSagas.payment.eth
          .create({ network: networks.eth })
          .chain()
          .setIsErc20(isSourceErc20)
          .setCoin(coin)
          .amount(amount)
          .fees(fees)
        break
      case 'XLM':
        payment = coreSagas.payment.xlm
          .create()
          .chain()
          .memoType('text')
          .memo(memo)
          .amount(amount)
          .setDestinationAccountExists(true)
        break
      default:
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'createPayment',
            'Could not create payment.'
          )
        )
        throw new Error('Could not create payment.')
    }
    payment = yield payment
      .fee(fees.priority)
      .from(sourceAddressOrIndex, addressType)
      .to(targetAddress, ADDRESS_TYPES.ADDRESS)
      .build()
      .done()
    yield put(
      actions.logs.logInfoMessage(logLocation, 'createPayment', payment)
    )
    return payment
  }

  const getDefaultBchAccountValue = function * () {
    const bchAccounts = yield select(S.bchGetActiveAccounts)
    return head(bchAccounts.getOrFail('Could not get BCH HD accounts.'))
  }

  const getDefaultBtcAccountValue = function * () {
    const btcAccounts = yield select(S.btcGetActiveAccounts)
    return head(btcAccounts.getOrFail('Could not get BTC HD accounts.'))
  }

  const getDefaultEthAccountValue = function * () {
    const ethAccounts = yield select(S.ethGetActiveAccounts)
    return head(ethAccounts.getOrFail('Could not get ETH accounts.'))
  }

  const getDefaultErc20AccountValue = function * (token) {
    const erc20Accounts = yield select(S.erc20GetActiveAccounts, token)
    return head(erc20Accounts.getOrFail('Could not get ERC20 accounts.'))
  }

  const getDefaultXlmAccountValue = function * () {
    const xlmAccounts = yield select(S.xlmGetActiveAccounts)
    return head(xlmAccounts.getOrFail('Could not get XLM accounts.'))
  }

  // TODO: make dynamic list in future
  const getDefaultAccount = function * (coin) {
    switch (coin) {
      case 'BCH':
        return yield call(getDefaultBchAccountValue)
      case 'BTC':
        return yield call(getDefaultBtcAccountValue)
      case 'ETH':
        return yield call(getDefaultEthAccountValue)
      case 'PAX':
        return yield call(getDefaultErc20AccountValue, 'pax')
      case 'XLM':
        return yield call(getDefaultXlmAccountValue)
      default:
        return yield call(getDefaultBtcAccountValue)
    }
  }

  const validateXlm = function * (volume, account) {
    try {
      const paymentValue = yield call(calculatePaymentMemo, account, 0)
      const payment = yield call(coreSagas.payment.xlm.create, {
        payment: paymentValue
      })
      payment.amount(volume)
    } catch (e) {
      if (e.message === 'Account does not exist') throw NO_ACCOUNT_ERROR
      if (e.message === 'Reserve exceeds remaining funds') throw RESERVE_ERROR
    }
  }

  const validateXlmAccountExists = account => {
    if (account.noAccount) throw NO_ACCOUNT_ERROR
  }

  const validateXlmCreateAccount = function * (volume, account) {
    const accountId = prop('address', account)
    const accountExists = (yield select(
      selectors.core.data.xlm.getAccount(accountId)
    ))
      .map(always(true))
      .getOrElse(false)
    if (accountExists) return

    const baseReserve = (yield select(
      selectors.core.data.xlm.getBaseReserve
    )).getOrElse('5000000')
    const volumeStroops = Exchange.convertCoinToCoin({
      value: volume,
      coin: 'XLM',
      baseToStandard: false
    }).value
    if (new BigNumber(baseReserve).multipliedBy(2).isGreaterThan(volumeStroops))
      throw CREATE_ACCOUNT_ERROR
  }

  const updateLatestEthTrade = function * (txId, sourceType) {
    // Update metadata
    if (ADDRESS_TYPES.LOCKBOX === sourceType) {
      yield put(
        actions.core.kvStore.lockbox.setLatestTxTimestampEthLockbox(Date.now())
      )
      yield take(actionTypes.core.kvStore.eth.FETCH_METADATA_LOCKBOX_SUCCESS)
      yield put(actions.core.kvStore.lockbox.setLatestTxEthLockbox(txId))
    } else {
      yield put(actions.core.kvStore.eth.setLatestTxTimestampEth(Date.now()))
      yield take(actionTypes.core.kvStore.eth.FETCH_METADATA_ETH_SUCCESS)
      yield put(actions.core.kvStore.eth.setLatestTxEth(txId))
    }
  }

  return {
    calculatePaymentMemo,
    calculateProvisionalPayment,
    createPayment,
    getDefaultAccount,
    updateLatestEthTrade,
    validateXlm,
    validateXlmAccountExists,
    validateXlmCreateAccount
  }
}
