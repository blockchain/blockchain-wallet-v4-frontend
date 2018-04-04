import { call, select } from 'redux-saga/effects'
import { merge, is, converge, or, zip } from 'ramda'
import Task from 'data.task'

import * as S from '../../selectors'
import { sign } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import { Wallet, HDAccount } from '../../../types'
import { isValidBitcoinAddress, privateKeyStringToKey, detectPrivateKeyFormat } from '../../../utils/bitcoin'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

/**
  Usage:
    // sequential
    let payment = createPayment({ network })
    payment = yield payment.fee(myFee)
    payment = yield payment.amount(myAmount)

    // chained
    let payment = yield createPayment({ network })
      .chain().fee(myFee).amount(myAmount).done()
*/

const isNumber = is(Number)
const isPositiveNumber = (x) => isNumber(x) && x >= 0
const isPositiveInteger = (x) => isPositiveNumber(x) && Math.round(x) === x

const mapGen = function * (f, xs) {
  let result = []
  for (let i = 0; i < xs.length; i++) {
    result.push(yield f(xs[i]))
  }
  return result
}

export default function createPaymentFactory ({ api, fetchUnspent, pushBitcoinTx }) {
  const calculateTo = function * (destinations) {
    let isUpgradedToHD = yield select(S.wallet.isHdWallet)
    let accountsCount = Wallet.selectHDAccounts(yield select(S.wallet.getWallet)).size

    let isValidIndex = (i) => (
      isPositiveInteger(i) &&
      isUpgradedToHD &&
      (i < accountsCount)
    )

    let accountToAddress = function * (i) {
      if (isPositiveInteger(i)) {
        let account = yield select(S.wallet.getAccount(i))
        let receiveIndex = (yield select(S.data.bitcoin.getReceiveIndex(account.xpub)))
          .getOrFail(new Error('missing_receive_address'))
        return HDAccount.getReceiveAddress(account, receiveIndex)
      } else {
        return i
      }
    }

    if (isValidBitcoinAddress(destinations)) {
      return [destinations]
    }

    if (isValidIndex(destinations)) {
      return [yield call(accountToAddress, destinations)]
    }

    let validAddressOrIndex = converge(or, [isValidBitcoinAddress, isValidIndex])
    if (Array.isArray(destinations) && destinations.length > 0 && destinations.every(validAddressOrIndex)) {
      return yield call(mapGen, accountToAddress, destinations)
    }

    throw new Error('no_destination_set')
  }

  const calculateAmount = function * (amounts) {
    if (isPositiveNumber(amounts)) {
      return [amounts]
    }

    if (Array.isArray(amounts) && amounts.length > 0 && amounts.every(isPositiveNumber)) {
      return amounts
    }

    throw new Error('no_amount_set')
  }

  const calculateFrom = function * (origin) {
    let pkFormat = detectPrivateKeyFormat(origin)
    let accountsCount = Wallet.selectHDAccounts(yield select(S.wallet.getWallet)).size

    // No origin => assume origin = all the legacy addresses (non - watchOnly)
    if (origin === null || origin === undefined || origin === '') {
      let spendableActiveAddresses = yield select(S.wallet.getSpendableActiveAddresses)
      return {
        from: spendableActiveAddresses,
        change: spendableActiveAddresses[0]
      }
    }

    // Single bitcoin address
    if (isValidBitcoinAddress(origin)) {
      return {
        from: [origin],
        change: origin
      }
    }

    // Multiple legacy addresses
    if (Array.isArray(origin) && origin.length > 0 && origin.every(isValidBitcoinAddress)) {
      return {
        from: origin,
        change: origin[0]
      }
    }

    // Single account index
    if (isPositiveInteger(origin) && (origin < accountsCount)) {
      let account = yield select(S.wallet.getAccount(origin))
      let changeAddress = (yield select(S.data.bitcoin.getChangeIndex(account.xpub)))
        .map((index) => HDAccount.getChangeAddress(account, index))
        .getOrFail(new Error('missing_change_address'))
      return {
        from: [account.xpub],
        change: changeAddress,
        fromAccountIdx: origin
      }
    }

    // From private key
    if (pkFormat !== null) {
      let key = privateKeyStringToKey(origin, pkFormat)
      key.compressed = false
      let addrUncomp = key.getAddress()
      let uWIF = key.toWIF()
      key.compressed = true
      let addrComp = key.getAddress()
      let cWIF = key.toWIF()

      let ukey = yield select(S.wallet.getAddress(addrUncomp))
      let ckey = yield select(S.wallet.getAddress(addrComp))

      if (ukey && ukey.isWatchOnly) {
        return {
          from: [addrUncomp],
          change: addrUncomp,
          wifKeys: [uWIF],
          fromWatchOnly: true
        }
      }

      if (ckey && ckey.isWatchOnly) {
        return {
          from: [addrComp],
          change: addrComp,
          wifKeys: [cWIF],
          fromWatchOnly: true
        }
      }

      return {
        from: [addrComp, addrUncomp],
        change: addrComp,
        wifKeys: [cWIF, uWIF]
      }
    }

    throw new Error('no_origin_set')
  }

  const calculateFee = function * (fee, fees) {
    if (isPositiveNumber(fee)) {
      return fee
    }

    if (['regular', 'priority'].indexOf(fee) > -1) {
      return fees[fee]
    }

    throw new Error('no_fee_set')
  }

  const calculateSelection = function * ({ to, amount, fee, coins, change }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (!amount) {
      throw new Error('missing_amount')
    }

    if (!fee) {
      throw new Error('missing_fee_per_byte')
    }

    if (!coins) {
      throw new Error('missing_coins')
    }

    if (!change) {
      throw new Error('missing_change_address')
    }

    let targets = zip(to, amount).map(([address, value]) => Coin.fromJS({ address, value }))
    return CoinSelection.descentDraw(targets, fee, coins, change)
  }

  const calculateSweepSelection = function * ({ to, fee, coins }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (to.length !== 1) {
      throw new Error('can_only_sweep_to_one_target')
    }

    if (!fee) {
      throw new Error('missing_fee_per_byte')
    }

    if (!coins) {
      throw new Error('missing_coins')
    }

    return CoinSelection.selectAll(fee, coins, to[0])
  }

  return function createPayment ({ network } = {}) {
    const makePayment = (p) => ({
      value () {
        return p
      },

      * init () {
        let fees = yield call(api.getBitcoinFee)
        return makePayment(merge(p, { fees }))
      },

      * to (destinations) {
        let to = yield call(calculateTo, destinations)
        return makePayment(merge(p, { to }))
      },

      * amount (amounts) {
        let amount = yield call(calculateAmount, amounts)
        return makePayment(merge(p, { amount }))
      },

      * from (origins) {
        let { from, change, wifKeys, fromAccountIdx, fromWatchOnly } = yield call(calculateFrom, origins)
        let coins = yield call(fetchUnspent, from)
        return makePayment(merge(p, { from, change, wifKeys, fromAccountIdx, fromWatchOnly, coins }))
      },

      * fee (value) {
        let fee = yield call(calculateFee, value, p.fees)
        return makePayment(merge(p, { fee }))
      },

      * build () {
        let selection = yield call(calculateSelection, p)
        return makePayment(merge(p, { selection }))
      },

      * buildSweep () {
        let selection = yield call(calculateSweepSelection, p)
        return makePayment(merge(p, { selection }))
      },

      * sign (password) {
        if (!p.selection) {
          throw new Error('missing_selection')
        }

        let wrapper = yield select(S.wallet.getWrapper)
        let signedT = sign(network, password, wrapper, p.selection)
        let signed = yield call(() => taskToPromise(signedT))

        return makePayment(merge(p, { signed }))
      },

      * publish () {
        if (!p.signed) {
          throw new Error('missing_signed_tx')
        }

        let publishT = Task.of(p.signed).chain(pushBitcoinTx)
        let publishResult = yield call(() => taskToPromise(publishT))

        return makePayment(merge(p, { result: publishResult }))
      },

      chain () {
        const chain = (gen, f) => makeChain(function * () {
          return yield f(yield gen())
        })

        const makeChain = (gen) => ({
          init: () => chain(gen, payment => payment.init()),
          to: (destinations) => chain(gen, payment => payment.to(destinations)),
          amount: (amounts) => chain(gen, payment => payment.amount(amounts)),
          from: (origins) => chain(gen, payment => payment.from(origins)),
          fee: (value) => chain(gen, payment => payment.fee(value)),
          build: () => chain(gen, payment => payment.build()),
          buildSweep: () => chain(gen, payment => payment.buildSweep()),
          sign: () => chain(gen, payment => payment.sign()),
          publish: () => chain(gen, payment => payment.publish()),
          * done () {
            return yield gen()
          }
        })

        return makeChain(function * () {
          return makePayment(p)
        })
      }
    })

    return makePayment({})
  }
}
