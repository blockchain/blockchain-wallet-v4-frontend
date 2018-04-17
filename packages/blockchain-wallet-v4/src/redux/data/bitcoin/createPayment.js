import { call, select } from 'redux-saga/effects'
import { merge, is, converge, or, zip, prop, map, assoc, drop, curry, set } from 'ramda'
import Task from 'data.task'

import * as S from '../../selectors'
import { btc } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import { Wallet, HDAccount, Address } from '../../../types'
import { isValidBitcoinAddress, privateKeyStringToKey, detectPrivateKeyFormat } from '../../../utils/bitcoin'
import { futurizeP } from 'futurize'
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

const FROM = {
  ACCOUNT: 'FROM.ACCOUNT',
  LEGACY: 'FROM.LEGACY',
  WATCH_ONLY: 'FROM.WATCH_ONLY',
  EXTERNAL: 'FROM.EXTERNAL'
}

const TO = {
  ACCOUNT: 'TO.ACCOUNT',
  ADDRESS: 'TO.ADDRESS'
}

const isString = is(String)
const isNumber = is(Number)
const isPositiveNumber = (x) => isNumber(x) && x >= 0
const isPositiveInteger = (x) => isPositiveNumber(x) && Math.round(x) === x

const toCoin = curry((network, fromData, input) => {
  switch (fromData.fromType) {
    case FROM.ACCOUNT:
      let path = input.xpub ? `${fromData.fromAccountIdx}${drop(1, input.xpub.path)}` : undefined
      return Coin.fromJS(assoc('path', path, input), network)
    case FROM.LEGACY:
      return Coin.fromJS(input, network)
    case FROM.WATCH_ONLY:
      return Coin.fromJS(assoc('priv', fromData.wifKeys[0], input), network)
    case FROM.EXTERNAL:
      let coin = Coin.fromJS(input, network)
      let address = Coin.selectAddress(coin)
      return set(Coin.priv, fromData.wifKeys[address], coin)
    default:
      throw new Error('fromType_not_recognized')
  }
})

const mapGen = function * (f, xs) {
  let result = []
  for (let i = 0; i < xs.length; i++) {
    result.push(yield f(xs[i]))
  }
  return result
}

export default function createPaymentFactory ({ api }) {
  // ///////////////////////////////////////////////////////////////////////////
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)
  const getWalletUnspent = (network, fromData) =>
    api.getBitcoinUnspents(fromData.from, -1)
      .then(prop('unspent_outputs'))
      .then(map(toCoin(network, fromData)))

  // ///////////////////////////////////////////////////////////////////////////
  const calculateTo = function * (destinations, network) {
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
        return {
          type: TO.ACCOUNT,
          accountIndex: i,
          addressIndex: receiveIndex,
          address: HDAccount.getReceiveAddress(account, receiveIndex, network)
        }
      } else {
        return {
          type: TO.ADDRESS,
          address: i
        }
      }
    }

    if (isValidBitcoinAddress(destinations)) {
      return [{ type: TO.ADDRESS, address: destinations }]
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
  const calculateFrom = function * (origin) {
    let pkFormat = detectPrivateKeyFormat(origin)
    let accountsCount = Wallet.selectHDAccounts(yield select(S.wallet.getWallet)).size

    // No origin => assume origin = all the legacy addresses (non - watchOnly)
    if (origin === null || origin === undefined || origin === '') {
      let spendableActiveAddresses = yield select(S.wallet.getSpendableActiveAddresses)
      return {
        fromType: FROM.LEGACY,
        from: spendableActiveAddresses,
        change: spendableActiveAddresses[0]
      }
    }

    // Single bitcoin address (they must be legacy addresses)
    if (isValidBitcoinAddress(origin)) {
      return {
        fromType: FROM.LEGACY,
        from: [origin],
        change: origin
      }
    }

    // Multiple legacy addresses (they must be legacy addresses)
    if (Array.isArray(origin) && origin.length > 0 && origin.every(isValidBitcoinAddress)) {
      return {
        fromType: FROM.LEGACY,
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
        fromType: FROM.ACCOUNT,
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
      let ukeyM = yield select(S.wallet.getAddress(addrUncomp))
      let ckeyM = yield select(S.wallet.getAddress(addrComp))
      let ukey = ukeyM.getOrElse(false)
      let ckey = ckeyM.getOrElse(false)

      if (ukey && Address.isWatchOnly(ukey)) {
        return {
          fromType: FROM.WATCH_ONLY,
          from: [addrUncomp],
          change: addrUncomp,
          wifKeys: [uWIF]
        }
      }

      if (ckey && Address.isWatchOnly(ckey)) {
        return {
          fromType: FROM.WATCH_ONLY,
          from: [addrComp],
          change: addrComp,
          wifKeys: [cWIF]
        }
      }

      let wifKeys = {}
      wifKeys[addrComp] = cWIF
      wifKeys[addrUncomp] = uWIF
      return {
        fromType: FROM.EXTERNAL,
        from: [addrComp, addrUncomp],
        change: addrComp,
        wifKeys
      }
    }

    throw new Error('no_origin_set')
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
  const calculateSelection = function ({ to, amount, fee, coins, change }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (!amount) {
      throw new Error('missing_amount')
    }

    if (!isPositiveInteger(fee)) {
      throw new Error('missing_fee_per_byte')
    }

    if (!coins) {
      throw new Error('missing_coins')
    }

    if (!change) {
      throw new Error('missing_change_address')
    }

    let targets = zip(to, amount).map(([target, value]) => Coin.fromJS({ address: target.address, value }))
    return CoinSelection.descentDraw(targets, fee, coins, change)
  }

  // ///////////////////////////////////////////////////////////////////////////
  const calculateSweepSelection = function ({ to, fee, coins }) {
    if (!to) {
      throw new Error('missing_to')
    }

    if (to.length !== 1) {
      throw new Error('can_only_sweep_to_one_target')
    }

    if (!isPositiveInteger(fee)) {
      throw new Error('missing_fee_per_byte')
    }

    if (!coins) {
      throw new Error('missing_coins')
    }

    return CoinSelection.selectAll(fee, coins, to[0].address)
  }

  const calculateEffectiveBalance = function ({ fee, coins }) {
    if (isPositiveInteger(fee) && coins) {
      const { outputs } = CoinSelection.selectAll(fee, coins, 'fake-target-address')
      return outputs[0].value
    } else {
      return undefined
    }
  }

  // ///////////////////////////////////////////////////////////////////////////
  return function createPayment ({ network, payment } = { network: undefined, payment: {} }) {
    const makePayment = (p) => ({
      value () {
        return p
      },

      * init () {
        let fees = yield call(api.getBitcoinFee)
        return makePayment(merge(p, { fees }))
      },

      * to (destinations) {
        let to = yield call(calculateTo, destinations, network)
        return makePayment(merge(p, { to }))
      },

      * amount (amounts) {
        let amount = yield call(calculateAmount, amounts)
        return makePayment(merge(p, { amount }))
      },

      * from (origins) {
        let fromData = yield call(calculateFrom, origins)
        let coins = yield call(getWalletUnspent, network, fromData)
        let effectiveBalance = yield call(calculateEffectiveBalance, {coins, fee: p.fee})
        return makePayment(merge(p, { ...fromData, coins, effectiveBalance }))
      },

      * fee (value) {
        let fee = yield call(calculateFee, value, p.fees)
        let effectiveBalance = yield call(calculateEffectiveBalance, {coins: p.coins, fee})
        return makePayment(merge(p, { fee, effectiveBalance }))
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
        let wrapper, signed, signedT
        switch (p.fromType) {
          case FROM.ACCOUNT:
            wrapper = yield select(S.wallet.getWrapper)
            signedT = btc.signHDWallet(network, password, wrapper, p.selection)
            signed = yield call(() => taskToPromise(signedT))
            return makePayment(merge(p, { ...signed }))
          case FROM.LEGACY:
            wrapper = yield select(S.wallet.getWrapper)
            signedT = btc.signLegacy(network, password, wrapper, p.selection)
            signed = yield call(() => taskToPromise(signedT))
            return makePayment(merge(p, { ...signed }))
          case FROM.WATCH_ONLY:
          case FROM.EXTERNAL:
            signed = btc.signWithWIF(network, p.selection)
            return makePayment(merge(p, { ...signed }))
          default:
            break
        }
      },

      * publish () {
        if (!p.txHex) {
          throw new Error('missing_signed_tx')
        }
        let publishT = pushBitcoinTx(p.txHex)
        let publishResult = yield call(() => taskToPromise(publishT))
        // if (description) {
        //   dispatch save description action (modify payload)
        // }
        return makePayment(merge(p, { result: publishResult }))
      },

      description (message) {
        return isString(message)
          ? makePayment(merge(p, { description: message }))
          : makePayment(p)
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
          sign: (password) => chain(gen, payment => payment.sign(password)),
          publish: () => chain(gen, payment => payment.publish()),
          * done () {
            return yield gen()
          }
        })

        return makeChain(function * () {
          return yield call(makePayment, p)
        })
      }
    })

    return makePayment(payment)
  }
}
