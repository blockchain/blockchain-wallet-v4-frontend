import { getKeyPair } from '../utils/xlm'
import * as StellarSdk from 'stellar-sdk'
import Str from '@ledgerhq/hw-app-str'

export const sign = async ({ secondPassword, securityModule }, transaction) => {
  const keyPair = await getKeyPair({ secondPassword, securityModule })
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
