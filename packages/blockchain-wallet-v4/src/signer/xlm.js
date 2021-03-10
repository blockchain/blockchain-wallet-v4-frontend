import Str from '@ledgerhq/hw-app-str'
import { call } from 'redux-saga/effects'
import * as StellarSdk from 'stellar-sdk'

import { getKeyPair } from '../utils/xlm'

export const sign = function * ({ transaction }, mnemonic) {
  const keyPair = yield call(getKeyPair, mnemonic)
  transaction.sign(keyPair)
  return transaction
}

export const signWithLockbox = function * (transport, transaction, scrambleKey) {
  const str = new Str(transport, scrambleKey)
  const { signature } = yield str.signTransaction(
    "44'/148'/0'",
    transaction.signatureBase()
  )
  const keyPair = StellarSdk.Keypair.fromPublicKey(transaction.source)
  const hint = keyPair.signatureHint()
  const decorated = new StellarSdk.xdr.DecoratedSignature({ hint, signature })
  transaction.signatures.push(decorated)
  return transaction
}
