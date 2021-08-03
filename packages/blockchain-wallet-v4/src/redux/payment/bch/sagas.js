import Task from 'data.task'
import { futurizeP } from 'futurize'
import { identity, isEmpty, isNil, map, merge, prop, zip } from 'ramda'
import { call, select } from 'redux-saga/effects'

import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import { bch } from '../../../signer'
import { fromCashAddr, isCashAddr } from '../../../utils/bch'
import { detectPrivateKeyFormat, privateKeyStringToKey } from '../../../utils/btc'
import { isPositiveInteger, isPositiveNumber, isString } from '../../../utils/checks'
import * as S from '../../selectors'
import settingsSagaFactory from '../../settings/sagas'
import {
  ADDRESS_TYPES,
  fromCustodial,
  fromLegacy,
  fromLegacyList,
  fromPrivateKey,
  isValidAddressOrIndex,
  toCoin,
  toOutput
} from '../btc/utils'
import { fromAccount } from './utils'

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

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

export default ({ api }) => {
  // ///////////////////////////////////////////////////////////////////////////
  const settingsSagas = settingsSagaFactory({ api })
  const pushBchTx = futurizeP(Task)(api.pushBchTx)
  const getWalletUnspent = (network, fromData) =>
    api
      .getBchUnspents(fromData.from)
      .then(prop('unspent_outputs'))
      .then(map(toCoin(network, fromData)))

  // ///////////////////////////////////////////////////////////////////////////
  const calculateTo = function* (destinations, type, network) {
    const appState = yield select(identity)
    const wallet = S.wallet.getWallet(appState)
    // if address or account index
    if (isValidAddressOrIndex(destinations)) {
      return [toOutput('BCH', network, appState, destinations, type)]
    }

    // if non-empty array of addresses or account indexes
    if (
      Array.isArray(destinations) &&
      destinations.length > 0 &&
      destinations.every(isValidAddressOrIndex(wallet))
    ) {
      return map(toOutput('BCH', network, appState), destinations)
    }

    throw new Error('no_destination_set')
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateAmount = function (amounts) {
    if (isPositiveNumber(amounts)) {
      return [amounts]
    }

    if (Array.isArray(amounts) && amounts.length > 0 && amounts.every(isPositiveNumber)) {
      return amounts
    }

    throw new Error('no_amount_set')
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateFrom = function* (origin, type, network) {
    const appState = yield select(identity)
    const wallet = S.wallet.getWallet(appState)

    // No origin => assume origin = all the legacy addresses (non - watchOnly)
    if (isNil(origin) || origin === '') {
      const spendableActiveAddresses = yield select(S.wallet.getSpendableActiveAddresses)
      return fromLegacyList(spendableActiveAddresses)
    }

    switch (type) {
      case ADDRESS_TYPES.ACCOUNT:
        return fromAccount(network, appState, origin, 'BCH')
      case ADDRESS_TYPES.CUSTODIAL:
        return fromCustodial(origin)
      case ADDRESS_TYPES.LEGACY:
        if (isCashAddr(origin)) {
          return fromLegacy(fromCashAddr(origin))
        }
        if (Array.isArray(origin) && origin.length > 0) {
          return fromLegacyList(origin)
        }
        return fromLegacy(origin)
      default:
        const pkformat = detectPrivateKeyFormat(origin)
        if (pkformat != null) {
          const pkFormat = detectPrivateKeyFormat(origin)
          const key = privateKeyStringToKey(origin, pkFormat, network)
          return fromPrivateKey(network, wallet, key)
        }
        throw new Error('no_origin_set')
    }
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateFee = function (fee, fees) {
    if (isPositiveNumber(fee)) {
      return fee
    }

    if (['regular', 'priority'].indexOf(fee) > -1) {
      return fees[fee]
    }

    throw new Error('no_fee_set')
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateSelection = function ({ amount, change, coins, effectiveBalance, fee, to }) {
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

    const targets = zip(to, amount).map(([target, value]) =>
      target.type === ADDRESS_TYPES.SCRIPT
        ? Coin.fromJS({ script: target.script, value })
        : Coin.fromJS({ address: target.address, value })
    )
    return CoinSelection.descentDraw(targets, fee, coins, change)
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateSweepSelection = function ({ coins, effectiveBalance, fee, to }) {
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

  const calculateEffectiveBalance = function ({ coins, fee }) {
    if (isPositiveInteger(fee) && coins) {
      const { outputs } = CoinSelection.selectAll(
        fee,
        coins,
        '16xq4AVL8shMiF3MYM7zm9Ac1G3QfUWjDi' // fake target address
      )
      return outputs[0].value
    }
    return undefined
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateSignature = function* (
    network,
    password,
    transport,
    scrambleKey,
    fromType,
    selection,
    changeIndex,
    lockSecret,
    coinDust
  ) {
    if (!selection) {
      throw new Error('missing_selection')
    }
    const wrapper = yield select(S.wallet.getWrapper)
    switch (fromType) {
      case ADDRESS_TYPES.ACCOUNT:
        return yield call(() =>
          taskToPromise(bch.signHDWallet(network, password, wrapper, selection, coinDust))
        )
      case ADDRESS_TYPES.LEGACY:
        return yield call(() =>
          taskToPromise(bch.signLegacy(network, password, wrapper, selection, coinDust))
        )
      case ADDRESS_TYPES.WATCH_ONLY:
      case ADDRESS_TYPES.EXTERNAL:
        return bch.signWithWIF(network, selection)
      default:
        throw new Error('unknown_from')
    }
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculatePublish = function* (txHex, lockSecret) {
    if (!txHex) {
      throw new Error('missing_signed_tx')
    }
    return yield call(() => taskToPromise(pushBchTx(txHex, lockSecret)))
  }

  // ///////////////////////////////////////////////////////////////////////////
  function create({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = (p) => ({
      *amount(amounts) {
        const amount = yield call(calculateAmount, amounts)
        return makePayment(merge(p, { amount }))
      },

      *build() {
        if (p.fromType === 'CUSTODIAL') return makePayment(p)
        const selection = yield call(calculateSelection, p)
        return makePayment(merge(p, { selection }))
      },

      *buildSweep() {
        const selection = yield call(calculateSweepSelection, p)
        return makePayment(merge(p, { selection }))
      },

      coin: 'BCH',

      chain() {
        const chain = (gen, f) =>
          makeChain(function* () {
            return yield f(yield gen())
          })

        const makeChain = (gen) => ({
          init: () => chain(gen, (payment) => payment.init()),
          amount: amounts => chain(gen, payment => payment.amount(amounts)),
          to: (destinations, type) =>
            chain(gen, payment => payment.to(destinations, type)),
          fee: value => chain(gen, payment => payment.fee(value)),
          from: (origins, type) =>
            chain(gen, payment => payment.from(origins, type)),
          build: () => chain(gen, (payment) => payment.build()),
          buildSweep: () => chain(gen, (payment) => payment.buildSweep()),
          publish: () => chain(gen, payment => payment.publish()),
          sign: password => chain(gen, payment => payment.sign(password)),
          description: (message) => chain(gen, (payment) => payment.description(message)),
          *done() {
            return yield gen()
          }
        })

        return makeChain(function* () {
          return yield call(makePayment, p)
        })
      },

      *fee(value) {
        if (p.fromType === 'CUSTODIAL') return makePayment(merge(p, { selection: { fee: value } }))
        const fee = yield call(calculateFee, value, p.fees)
        const effectiveBalance = yield call(calculateEffectiveBalance, {
          coins: p.coins,
          fee
        })
        return makePayment(merge(p, { effectiveBalance, fee }))
      },

      description(message) {
        return isString(message) ? makePayment(merge(p, { description: message })) : makePayment(p)
      },

      *from(origins, type, defaultEffectiveBalance) {
        const fromData = yield call(calculateFrom, origins, type, network)
        try {
          const coins = yield call(getWalletUnspent, network, fromData)
          const effectiveBalance = yield call(calculateEffectiveBalance, {
            coins,
            fee: p.fee
          })
          return makePayment(merge(p, { ...fromData, coins, effectiveBalance }))
        } catch (e) {
          return makePayment(
            merge(p, {
              ...fromData,
              coins: [],
              effectiveBalance: defaultEffectiveBalance || 0
            })
          )
        }
      },

      *getCoinDust() {
        const dust = yield call(api.getBchDust)
        const script = prop('output_script', dust)
        const lockSecret = prop('lock_secret', dust)
        const coinDust = Coin.fromJS({ ...dust, script })

        return { coinDust, lockSecret }
      },

      *init() {
        const fees = yield call(api.getBchFees)
        return makePayment(merge(p, { coin: 'BCH', fees }))
      },

      *publish() {
        // call pushtx with incompleteTx and lockSecret
        const result = yield call(calculatePublish, p.txHex, p.lockSecret)
        yield call(settingsSagas.setLastTxTime)
        return makePayment(merge(p, { result }))
      },

      value() {
        return p
      },

      *sign(password, transport, scrambleKey) {
        // collect coin dust
        const { coinDust, lockSecret } = yield call(this.getCoinDust)
        const signed = yield call(
          calculateSignature,
          network,
          password,
          transport,
          scrambleKey,
          prop('fromType', p),
          prop('selection', p),
          prop('changeIndex', p),
          lockSecret,
          coinDust
        )
        return makePayment(merge(p, { ...signed, lockSecret }))
      },

      * to(destinations, type) {
        let to = yield call(calculateTo, destinations, type, network)
        return makePayment(merge(p, { to }))
      }
    })

    return makePayment(payment)
  }

  return {
    create
  }
}
