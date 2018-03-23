// @flow
import {call, select} from 'redux-saga/effects'
import {callP} from "../../../utils/types";

import {map, set} from 'ramda'
import {futurizeP} from 'futurize'
import Task from 'data.task'

import * as S from '../../selectors'
import {sign} from '../../../signer'
import * as CoinSelection from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import type {Api} from "../../../network/api";
import type {Saga} from "../../../utils/types";

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const bitcoin = (api: Api) => {
  const pushBitcoinTx = futurizeP(Task)(api.pushBitcoinTx)
  const addPrivToCoins = (priv, coins) => map(set(Coin.priv, priv), coins)

  const fetchUnspent = function * (addresses: string[]): Saga<Object> {
    let result = yield* callP(api.getBitcoinUnspents, addresses, -1)
    return result.unspent_outputs.map(Coin.fromJS)
  }

  const sweepAddress = function * (addr: string, priv: string, { network, index, fee, password }: any = {}): * {
    if (index == null) index = yield select(S.wallet.getDefaultAccountIndex)
    if (fee !== 'regular' && fee !== 'priority') fee = 'regular'

    let fees = yield* callP(api.getBitcoinFee)
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

  const signAndPublish = function * ({ network, selection, password }: any): any {
    let wrapper = yield select(S.wallet.getWrapper)
    let signAndPublish = sign(network, password, wrapper, selection).chain(pushBitcoinTx)
    return yield call(() => taskToPromise(signAndPublish))
  }

  return {
    fetchUnspent,
    sweepAddress,
    signAndPublish
  }
}
