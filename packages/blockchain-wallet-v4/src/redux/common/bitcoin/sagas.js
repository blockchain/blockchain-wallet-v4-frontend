import { call, put } from 'redux-saga/effects'
import { indexBy, prop, path } from 'ramda'
import * as A from './actions'

export const bitcoin = ({ api } = {}) => {
  const fetchBlockchainData = function * ({ context }) {
    // const data = yield call(api.fetchBlockchainData, context, { n: 1 })
    // const bitcoinData = {
    //   addresses: indexBy(prop('address'), prop('addresses', data)),
    //   info: path(['wallet'], data),
    //   latest_block: path(['info', 'latest_block'], data)
    // }
    // yield put(A.setBlockchainData(bitcoinData))
  }

  return {
    // fetchBlockchainData
  }
}
