import { call, select } from 'redux-saga/effects'
import { map, set } from 'ramda'
import { futurizeP } from 'futurize'
import Task from 'data.task'

import * as S from '../../selectors'
import { sign } from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }) => {
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)
  const addPrivToCoins = (priv, coins) => map(set(Coin.priv, priv), coins)

  const fetchUnspent = function * (addresses) {
    let result = yield call(api.getBitcoinUnspents, addresses, -1)
    return result.unspent_outputs.map(Coin.fromJS)
  }

  const sweepAddress = function * (addr, priv, { network, index, fee, password } = {}) {
    if (index == null) index = yield select(S.wallet.getDefaultAccountIndex)
    if (fee !== 'regular' && fee !== 'priority') fee = 'regular'

    let fees = yield call(api.getBitcoinFee)
    let coins = addPrivToCoins(priv, yield fetchUnspent([addr]))

    let receiveAddress = yield select(S.common.bitcoin.getNextAvailableReceiveAddress(network, index))
    let toAddress = receiveAddress.getOrElse(null)

    if (toAddress) {
      let selection = CoinSelection.selectAll(fees[fee], coins, toAddress)
      yield signAndPublish({ network, selection, password })
    } else {
      throw new Error('Could not get receive address to sweep to.')
    }
  }

  const signAndPublish = function * ({ network, selection, password }) {
    let wrapper = yield select(S.wallet.getWrapper)
    let signAndPublish = sign('BTC', network, password, wrapper, selection).chain(pushBitcoinTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    fetchUnspent,
    sweepAddress,
    signAndPublish
  }
}
