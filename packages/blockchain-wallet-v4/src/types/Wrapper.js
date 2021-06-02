import Either from 'data.either'
import Task from 'data.task'
import { assoc, compose, curry, dissoc, is, lensProp, pipe, prop } from 'ramda'
import { over, set, traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
import * as Options from './Options'
import Type from './Type'
import * as Wallet from './Wallet'

const PAYLOAD_VERSION = crypto.SUPPORTED_ENCRYPTION_VERSION

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

export class Wrapper extends Type {}

export const isWrapper = is(Wrapper)

export const pbkdf2Iterations = Wrapper.define('pbkdf2_iterations')
export const password = Wrapper.define('password')
export const version = Wrapper.define('version')
export const payloadChecksum = Wrapper.define('payload_checksum')
export const language = Wrapper.define('language')
export const syncPubKeys = Wrapper.define('sync_pubkeys')
export const warChecksum = Wrapper.define('war_checksum')
export const authType = Wrapper.define('auth_type')
export const realAuthType = Wrapper.define('real_auth_type')
export const wallet = Wrapper.define('wallet')

export const selectPbkdf2Iterations = view(pbkdf2Iterations)
export const selectPassword = view(password)
export const selectVersion = view(version)
export const selectPayloadChecksum = view(payloadChecksum)
export const selectLanguage = view(language)
export const selectSyncWarChecksum = view(warChecksum)
export const selectAuthType = view(authType)
export const selectRealAuthType = view(realAuthType)
export const selectWallet = view(wallet)
export const selectSyncPubKeys = view(syncPubKeys)

// traverseWallet :: Monad m => (a -> m a) -> (Wallet -> m Wallet) -> Wrapper -> m Wrapper
export const traverseWallet = curry((of, f, wrapper) =>
  of(wrapper).chain(traverseOf(wallet, of, f))
)

// fromJS :: JSON -> Wrapper
export const fromJS = (wrapper) => {
  if (isWrapper(wrapper)) {
    return wrapper
  }
  const wrapperCons = over(wallet, Wallet.fromJS)
  return wrapperCons(new Wrapper(wrapper))
}

// toJS :: wrapper -> JSON
export const toJS = pipe(Wrapper.guard, (wrapper) => {
  const wrapperDecons = over(wallet, Wallet.toJS)
  return wrapperDecons(wrapper).toJS()
})

export const reviver = (jsObject) => {
  return new Wrapper(jsObject)
}

// isLatestVersion :: Wrapper -> Boolean
export const isLatestVersion = (wrapper) => {
  return selectVersion(wrapper) === PAYLOAD_VERSION
}

export const upgradeToV3 = curry((mnemonic, password, network, wrapper) => {
  const upgradeWallet = Wallet.upgradeToV3(mnemonic, 'BTC Private Key Wallet', password, network)

  const upgradeWrapper = compose(traverseWallet(Task.of, upgradeWallet), set(version, 3.0))

  return upgradeWrapper(wrapper)
})

// upgradeToV4 :: String -> String -> Network -> Wrapper -> Task Error Wrapper
export const upgradeToV4 = curry((seedHex, password, network, wrapper) => {
  const upgradeWallet = Wallet.upgradeToV4(seedHex, password, network)

  const upgradeWrapper = compose(
    traverseWallet(Task.of, upgradeWallet),
    set(version, PAYLOAD_VERSION)
  )

  return upgradeWrapper(wrapper)
})

// computeChecksum :: encJSON -> String
export const computeChecksum = compose(
  (payload) => crypto.sha256(payload).toString('hex'),
  prop('payload')
)

// fromEncJSON :: String -> JSON -> Task Error Wrapper
export const fromEncJSON = curry((password, json) => {
  const payloadL = lensProp('payload')
  const payloadJsonE = Either.try(JSON.parse)(json.payload)

  // assocIterations :: Number -> Wrapper
  const assocIterations = (wrapper) =>
    payloadJsonE
      .map((payload) => assoc('pbkdf2_iterations', payload.pbkdf2_iterations, wrapper))
      .getOrElse(wrapper)

  // assocVersion :: Wrapper -> Wrapper
  const assocVersion = (wrapper) =>
    payloadJsonE.map((payload) => assoc('version', payload.version, wrapper)).getOrElse(wrapper)

  return traverseOf(payloadL, Task.of, Wallet.fromEncryptedPayload(password), json)
    .map(assocVersion)
    .map(assocIterations)
    .map((o) => assoc('wallet', o.payload, o))
    .map(dissoc('payload'))
    .map(assoc('password', password))
    .map(dissoc('extra_seed'))
    .map(dissoc('symbol_btc'))
    .map(dissoc('symbol_local'))
    .map(dissoc('guid'))
    .map(dissoc('initial_success'))
    .map(fromJS)
})

// This is needed because the 2FA login hits a different endpoint to login (review that)
// fromEncPayload :: String -> JSON -> Task Error Wrapper
export const fromEncPayload = curry((password, payload) => {
  const pbkdf2Iterations = prop('pbkdf2_iterations', payload)
  const version = prop('version', payload)
  const wrapper = {
    password,
    payload: JSON.stringify(payload),
    pbkdf2Iterations,
    version
  }

  return traverseOf(lensProp('payload'), Task.of, Wallet.fromEncryptedPayload(password), wrapper)
    .map((o) => assoc('wallet', o.payload, o))
    .map(dissoc('payload'))
    .map(fromJS)
})

// toEncJSON :: Wrapper -> Either Error JSON
export const toEncJSON = (wrapper) => {
  const W = Wallet
  const plens = lensProp('payload')
  const response = {
    guid: compose(W.selectGuid, selectWallet)(wrapper),
    language: selectLanguage(wrapper),
    old_checksum: selectPayloadChecksum(wrapper),
    payload: selectWallet(wrapper),
    sharedKey: compose(W.selectSharedKey, selectWallet)(wrapper)
  }
  const encrypt = W.toEncryptedPayload(
    selectPassword(wrapper),
    selectPbkdf2Iterations(wrapper) || 5000,
    selectVersion(wrapper)
  )
  const hash = (x) => crypto.sha256(x).toString('hex')
  return traverseOf(plens, Task.of, encrypt, response)
    .map((r) => assoc('length', view(plens, r).length, r))
    .map((r) => assoc('checksum', hash(view(plens, r)), r))
}

// new wallets
export const js = (
  password,
  guid,
  sharedKey,
  label,
  mnemonic,
  language,
  nAccounts = 1,
  network
) => ({
  language,
  password,
  payload_checksum: '',
  pbkdf2_iterations: 5000,
  storage_token: '',
  sync_pubkeys: false,
  version: PAYLOAD_VERSION,
  wallet: Wallet.js(guid, sharedKey, label, mnemonic, nAccounts, network),
  war_checksum: ''
})

export const setBothPbkdf2Iterations = curry((iterations, wrapper) =>
  compose(
    set(compose(wallet, Wallet.options, Options.pbkdf2Iterations), iterations),
    set(pbkdf2Iterations, iterations)
  )(wrapper)
)

export const createNew = (
  guid,
  password,
  sharedKey,
  mnemonic,
  language,
  firstAccountName = 'Private Key Wallet',
  nAccounts = 1,
  network
) => fromJS(js(password, guid, sharedKey, firstAccountName, mnemonic, language, nAccounts, network))

export const createNewReadOnly = (xpub, firstAccountName = 'My read-only Wallet') =>
  fromJS(js('', '', '', firstAccountName, undefined, xpub, 1))
