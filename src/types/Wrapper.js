import * as R from 'ramda'
import * as crypto from '../WalletCrypto'
import { Map } from 'immutable-ext'
import { traverseOf } from 'ramda-lens'
import Either from 'data.either'
import { typeDef } from '../util'
import * as Wallet from './Wallet'

/* Wrapper :: {
     wallet             :: Wallet
     war_checksum       :: String
     password           :: String
     clientTimeDiff     :: Number
     sync_pubkeys       :: Boolean
     serverTime         :: Number
     real_auth_type     :: Number
     auth_type          :: Number
     payload_checksum   :: String
     language           :: String
     version            :: String
} */

function Wrapper (x) {
  this.__internal = Map(x)
}

const { guard, define } = typeDef(Wrapper)

export const pbkdf2Iterations = define('pbkdf2_iterations')
export const password = define('password')
export const version = define('version')
export const payloadChecksum = define('payload_checksum')
export const language = define('language')
export const syncPubkeys = define('sync_pubkeys')
export const warChecksum = define('war_checksum')
export const authType = define('auth_type')
export const realAuthType = define('real_auth_type')
export const wallet = define('wallet')

export const selectPbkdf2Iterations = R.view(pbkdf2Iterations)
export const selectPassword = R.view(password)
export const selectVersion = R.view(version)
export const selectPayloadChecksum = R.view(payloadChecksum)
export const selectLanguage = R.view(language)
export const selectSyncWarChecksum = R.view(warChecksum)
export const selectAuthType = R.view(authType)
export const selectRealAuthType = R.view(realAuthType)
export const selectWallet = R.view(wallet)

// traverseWallet :: Monad m => (a -> m a) -> (Wallet -> m Wallet) -> Wrapper
export const traverseWallet = R.curry(
  (of, f, wrapper) => of(wrapper).chain(traverseOf(wallet, of, f))
)

// fromJS :: JSON -> wrapper
export const fromJS = (js) => {
  if (js instanceof Wrapper) { return js }
  const walletCons = R.over(R.lensProp('wallet'), Wallet.fromJS)
  return new Wrapper(walletCons(js))
}

// toJS :: wrapper -> JSON
export const toJS = R.pipe(guard, (wrapper) => {
  const selectWalletJS = R.compose(Wallet.toJS, selectWallet)
  const destructWallet = R.set(wallet, selectWalletJS(wrapper))
  const destructWrapper = R.compose(destructWallet)
  return destructWrapper(wrapper).__internal.toJS()
})

// fromEncJSON :: String -> JSON -> Either Error Wrapper
export const fromEncJSON = R.curry((password, json) => {
  const plens = R.lensProp('payload')
  const ilens = R.lensProp('pbkdf2_iterations')
  const vlens = R.lensProp('version')
  const EitherPayload = Either.try(JSON.parse)(R.view(R.compose(plens), json))
  const EitherIter = EitherPayload.map(R.view(ilens))
  const EitherVer = EitherPayload.map(R.view(vlens))
  // assocIterations :: Number => Either Error Wrapper
  const assocIterations = wrapper =>
    EitherIter.map(it => R.assoc('pbkdf2_iterations', it, wrapper))
  // assocVersion :: Number => Either Error Wrapper
  const assocVersion = wrapper =>
    EitherVer.map(it => R.assoc('version', it, wrapper))
  return traverseOf(plens, Either.of, Wallet.fromEncryptedPayload(password), json)
         .chain(assocVersion)
         .chain(assocIterations)
         .map(o => R.assoc('wallet', o.payload, o))
         .map(R.dissoc('payload'))
         .map(R.assoc('password', password))
         .map(R.dissoc('extra_seed'))
         .map(R.dissoc('symbol_btc'))
         .map(R.dissoc('symbol_local'))
         .map(R.dissoc('guid'))
         .map(R.dissoc('initial_success'))
         .map(fromJS)
})

// toEncJSON :: Wrapper -> Either Error JSON
export const toEncJSON = wrapper => {
  const plens = R.lensProp('payload')
  const response = {
    guid: R.compose(Wallet.selectGuid, selectWallet)(wrapper),
    sharedKey: R.compose(Wallet.selectSharedKey, selectWallet)(wrapper),
    payload: selectWallet(wrapper),
    old_checksum: selectPayloadChecksum(wrapper),
    language: selectLanguage(wrapper)
  }
  const encrypt = Wallet.toEncryptedPayload(selectPassword(wrapper))
  const hash = (x) => crypto.sha256(x).toString('hex')
  return traverseOf(plens, Either.of, encrypt, response)
         .map((r) => R.assoc('length', R.view(plens, r).length, r))
         .map((r) => R.assoc('checksum', hash(R.view(plens, r)), r))
}
