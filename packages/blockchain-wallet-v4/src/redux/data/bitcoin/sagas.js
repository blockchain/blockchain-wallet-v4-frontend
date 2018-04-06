import { call, select } from 'redux-saga/effects'
import { map, set, merge } from 'ramda'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as S from '../../selectors'
import * as signer from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import createPaymentFactory from './createPayment'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = ({ api } = {}) => {
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)
  // const addPrivToCoins = (priv, coins) => map(set(Coin.priv, priv), coins)

  const fetchUnspent = function * (addresses) {
    let result = yield call(api.getBitcoinUnspents, addresses, -1)
    return result.unspent_outputs
      .map((coin) => merge(coin, { xpub: merge(coin.xpub, { index: 0 }) }))
      .map(Coin.fromJS)
  }

  // const sweepAddress = function * (addr, priv, { network, index, fee, password } = {}) {
  //   if (index == null) index = yield select(S.wallet.getDefaultAccountIndex)
  //   if (fee !== 'regular' && fee !== 'priority') fee = 'regular'

  //   let fees = yield call(api.getBitcoinFee)
  //   let coins = addPrivToCoins(priv, yield fetchUnspent([addr]))

  //   let receiveAddress = yield select(S.common.bitcoin.getNextAvailableReceiveAddress(network, index))
  //   let toAddress = receiveAddress.getOrElse(null)

  //   if (toAddress) {
  //     let selection = CoinSelection.selectAll(fees[fee], coins, toAddress)
  //     yield signAndPublish({ network, selection, password })
  //   } else {
  //     throw new Error('Could not get receive address to sweep to.')
  //   }
  // }

  const signAndPublish = function * ({ network, selection, password }) {
    let wrapper = yield select(S.wallet.getWrapper)
    let signAndPublish = signer.btc.sign(network, password, wrapper, selection).chain(pushBitcoinTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    // fetchUnspent,
    // sweepAddress,
    signAndPublish,
    createPayment: createPaymentFactory({ api, fetchUnspent, pushBitcoinTx })
  }
}
