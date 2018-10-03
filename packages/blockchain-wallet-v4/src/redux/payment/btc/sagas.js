import { call, select } from 'redux-saga/effects'
import { merge, zip, prop, map, identity, isNil, isEmpty } from 'ramda'
import Task from 'data.task'

import * as S from '../../selectors'
import { btc } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import {
  isValidBitcoinAddress,
  privateKeyStringToKey,
  detectPrivateKeyFormat
} from '../../../utils/btc'
import { futurizeP } from 'futurize'
import {
  isString,
  isPositiveNumber,
  isPositiveInteger
} from '../../../utils/checks'
import {
  FROM,
  toCoin,
  isValidAddressOrIndex,
  toOutput,
  fromLegacy,
  fromLegacyList,
  fromAccount,
  fromPrivateKey
} from './utils'
export const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

/**
  Usage:
    // sequential
    let payment = create({ network })
    payment = yield payment.fee(myFee)
    payment = yield payment.amount(myAmount)

    // chained
    let payment = yield create({ network })
      .chain().fee(myFee).amount(myAmount).done()
*/

const fallbackFees = { limits: { min: 2, max: 16 }, regular: 5, priority: 11 }

export default ({ api }) => {
  const __pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)
  const __getWalletUnspent = (network, fromData) =>
    api
      .getBitcoinUnspents(fromData.from, -1)
      .then(prop('unspent_outputs'))
      .then(map(toCoin(network, fromData)))

  const __calculateTo = function*(destinations, network) {
    const appState = yield select(identity)
    const wallet = S.wallet.getWallet(appState)

    // if address or account index
    if (isValidAddressOrIndex(destinations)) {
      return [toOutput('BTC', network, appState, destinations)]
    }

    // if non-empty array of addresses or account indexes
    if (
      Array.isArray(destinations) &&
      destinations.length > 0 &&
      destinations.every(isValidAddressOrIndex(wallet))
    ) {
      return map(toOutput('BTC', network, appState), destinations)
    }

    throw new Error('no_destination_set')
  }

  const __calculateAmount = function (amounts) {
    if (isPositiveNumber(amounts)) {
      return [amounts]
    }

    if (
      Array.isArray(amounts) &&
      amounts.length > 0 &&
      amounts.every(isPositiveNumber)
    ) {
      return amounts
    }

    throw new Error('no_amount_set')
  }

  const __calculateFrom = function*(origin, network) {
    const appState = yield select(identity)
    const wallet = S.wallet.getWallet(appState)

    // No origin => assume origin = all the legacy addresses (non - watchOnly)
    if (isNil(origin) || origin === '') {
      let spendableActiveAddresses = yield select(
        S.wallet.getSpendableActiveAddresses
      )
      return fromLegacyList(spendableActiveAddresses)
    }

    // Single bitcoin address (they must be legacy addresses)
    if (isValidBitcoinAddress(origin, network)) {
      return fromLegacy(origin)
    }

    // Multiple legacy addresses (they must be legacy addresses)
    if (
      Array.isArray(origin) &&
      origin.length > 0 &&
      origin.every(isValidBitcoinAddress)
    ) {
      return fromLegacyList(origin)
    }

    // Single account index
    if (isPositiveInteger(origin)) {
      return fromAccount(network, appState, origin, 'BTC')
    }

    // From private key (watch only: compressed / uncompressed, external)
    const pkformat = detectPrivateKeyFormat(origin)
    if (pkformat != null) {
      let pkFormat = detectPrivateKeyFormat(origin)
      let key = privateKeyStringToKey(origin, pkFormat, network)
      return fromPrivateKey(network, wallet, key)
    }

    throw new Error('no_origin_set')
  }

  const __calculateFee = function (fee, fees) {
    if (isPositiveNumber(fee)) {
      return fee
    }

    if (['regular', 'priority'].indexOf(fee) > -1) {
      return fees[fee]
    }

    throw new Error('no_fee_set')
  }

  const __calculateSelection = function ({
    to,
    amount,
    fee,
    coins,
    change,
    effectiveBalance
  }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (!amount) {
      throw new Error('missing_amount')
    }

    if (!isPositiveInteger(fee)) {
      throw new Error('missing_fee_per_byte')
    }

    if (isNil(coins)) {
      throw new Error('missing_coins')
    }

    if (isEmpty(coins) || effectiveBalance <= 0) {
      throw new Error('empty_addresses')
    }

    if (!change) {
      throw new Error('missing_change_address')
    }

    let targets = zip(to, amount).map(([target, value]) =>
      Coin.fromJS({ address: target.address, value })
    )
    return CoinSelection.descentDraw(targets, fee, coins, change)
  }

  const __calculateSweepSelection = function ({
    to,
    fee,
    coins,
    effectiveBalance
  }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (to.length !== 1) {
      throw new Error('can_only_sweep_to_one_target')
    }

    if (!isPositiveInteger(fee)) {
      throw new Error('missing_fee_per_byte')
    }

    if (isNil(coins)) {
      throw new Error('missing_coins')
    }

    if (isEmpty(coins) || effectiveBalance <= 0) {
      throw new Error('empty_addresses')
    }

    return CoinSelection.selectAll(fee, coins, to[0].address)
  }

  const __calculateEffectiveBalance = function ({ fee, coins }) {
    if (isPositiveInteger(fee) && coins) {
      const { outputs } = CoinSelection.selectAll(
        fee,
        coins,
        'fake-target-address'
      )
      return outputs[0].value
    } else {
      return undefined
    }
  }

  const __calculateSignature = function*(
    network,
    password,
    fromType,
    selection
  ) {
    if (!selection) {
      throw new Error('missing_selection')
    }
    const wrapper = yield select(S.wallet.getWrapper)
    switch (fromType) {
      case FROM.ACCOUNT:
        return yield call(() =>
          taskToPromise(btc.signHDWallet(network, password, wrapper, selection))
        )
      case FROM.LEGACY:
        return yield call(() =>
          taskToPromise(btc.signLegacy(network, password, wrapper, selection))
        )
      case FROM.WATCH_ONLY:
      case FROM.EXTERNAL:
        return btc.signWithWIF(network, selection)
      default:
        throw new Error('unknown_from')
    }
  }

  const __calculatePublish = function*(txHex) {
    if (!txHex) {
      throw new Error('missing_signed_tx')
    }
    return yield call(() => taskToPromise(__pushBitcoinTx(txHex)))
  }

  function create ({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = p => ({
      value () {
        return p
      },

      *init () {
        let fees
        try {
          fees = yield call(api.getBitcoinFee)
        } catch (e) {
          fees = fallbackFees
        }
        return makePayment(merge(p, { fees }))
      },

      *to (destinations) {
        let to = yield call(__calculateTo, destinations, network)
        return makePayment(merge(p, { to }))
      },

      *amount (amounts) {
        let amount = yield call(__calculateAmount, amounts)
        return makePayment(merge(p, { amount }))
      },

      *from (origins) {
        let fromData = yield call(__calculateFrom, origins, network)
        try {
          let coins = yield call(__getWalletUnspent, network, fromData)
          let effectiveBalance = yield call(__calculateEffectiveBalance, {
            coins,
            fee: p.fee
          })
          return makePayment(merge(p, { ...fromData, coins, effectiveBalance }))
        } catch (e) {
          return makePayment(
            merge(p, { ...fromData, coins: [], effectiveBalance: 0 })
          )
        }
      },

      *fee (value) {
        let fee = yield call(__calculateFee, value, prop('fees', p))
        let effectiveBalance = yield call(__calculateEffectiveBalance, {
          coins: prop('coins', p),
          fee
        })
        return makePayment(merge(p, { fee, effectiveBalance }))
      },

      *build () {
        let selection = yield call(__calculateSelection, p)
        return makePayment(merge(p, { selection }))
      },

      *buildSweep () {
        let selection = yield call(__calculateSweepSelection, p)
        return makePayment(merge(p, { selection }))
      },

      *sign (password) {
        let signed = yield call(
          __calculateSignature,
          network,
          password,
          prop('fromType', p),
          prop('selection', p)
        )
        return makePayment(merge(p, { ...signed }))
      },

      *publish () {
        let result = yield call(__calculatePublish, prop('txHex', p))
        return makePayment(merge(p, { result }))
      },

      description (message) {
        return isString(message)
          ? makePayment(merge(p, { description: message }))
          : makePayment(p)
      },

      chain () {
        const chain = (gen, f) =>
          makeChain(function*() {
            return yield f(yield gen())
          })

        const makeChain = gen => ({
          init: () => chain(gen, payment => payment.init()),
          to: destinations => chain(gen, payment => payment.to(destinations)),
          amount: amounts => chain(gen, payment => payment.amount(amounts)),
          from: origins => chain(gen, payment => payment.from(origins)),
          fee: value => chain(gen, payment => payment.fee(value)),
          build: () => chain(gen, payment => payment.build()),
          buildSweep: () => chain(gen, payment => payment.buildSweep()),
          sign: password => chain(gen, payment => payment.sign(password)),
          publish: () => chain(gen, payment => payment.publish()),
          description: message =>
            chain(gen, payment => payment.description(message)),
          *done () {
            return yield gen()
          }
        })

        return makeChain(function*() {
          return yield call(makePayment, p)
        })
      }
    })

    return makePayment(payment)
  }

  return {
    create,
    __calculateAmount,
    __calculateEffectiveBalance,
    __calculateFee,
    __calculateFrom,
    __calculatePublish,
    __calculateTo,
    __calculateSelection,
    __calculateSignature,
    __calculateSweepSelection,
    __getWalletUnspent,
    __pushBitcoinTx
  }
}
