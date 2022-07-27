import { ethers } from 'ethers'
import { call, put, select } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { getPrivateKey } from '@core/utils/eth'
import { selectors } from 'data'
import { WALLET_SIGNER_ERR } from 'data/components/nfts/sagas'
import { promptForSecondPassword } from 'services/sagas'

import { actions as A } from './slice'

export const logLocation = 'components/nfts/sagas'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

export default ({ api }: { api: APIType }) => {
  const getEthSigner = function* () {
    try {
      const password = yield call(promptForSecondPassword)
      const getMnemonic = (state) => selectors.core.wallet.getMnemonic(state, password)
      const mnemonicT = yield select(getMnemonic)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      const privateKey = getPrivateKey(mnemonic)
      const wallet = new ethers.Wallet(privateKey, api.ethProvider)
      return wallet
    } catch (e) {
      throw new Error(WALLET_SIGNER_ERR)
    }
  }

  const getPublicAddress = function* () {
    try {
      const signer: ethers.Wallet = yield call(getEthSigner)
      const address = yield signer.getAddress()
      yield put(A.setPublicAddress(address))
    } catch (e) {
      throw new Error(`Failed to get address. ${e}`)
    }
  }

  return {
    getPublicAddress
  }
}
