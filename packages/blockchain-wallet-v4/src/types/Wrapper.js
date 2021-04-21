import Either from 'data.either'
import Task from 'data.task'
import { assoc, compose, curry, dissoc, is, lensProp, pipe, prop } from 'ramda'
import { over, set, traverseOf, view } from 'ramda-lens'

import * as crypto from '../walletCrypto'
import * as Options from './Options'
import Type from './Type'
import * as Wallet from './Wallet'
import * as Wallet_DEPRECATED_V3 from './Wallet_DEPRECATED_V3'

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
export const fromJS = wrapper => {
  if (isWrapper(wrapper)) {
    return wrapper
  }
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  const wrapperCons = over(
    wallet,
    (wrapper.version === 4 ? Wallet : Wallet_DEPRECATED_V3).fromJS
  )
  return wrapperCons(new Wrapper(wrapper))
}

// toJS :: wrapper -> JSON
export const toJS = pipe(Wrapper.guard, wrapper => {
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  const wrapperDecons = over(
    wallet,
    (wrapper.version === 4 ? Wallet : Wallet_DEPRECATED_V3).toJS
  )
  return wrapperDecons(wrapper).toJS()
})

export const reviver = jsObject => {
  return new Wrapper(jsObject)
}

// isLatestVersion :: Wrapper -> Boolean
export const isLatestVersion = wrapper => {
  return selectVersion(wrapper) === PAYLOAD_VERSION
}

export const upgradeToV3 = curry((mnemonic, password, network, wrapper) => {
  let upgradeWallet = Wallet.upgradeToV3(
    mnemonic,
    'BTC Private Key Wallet',
    password,
    network
  )

  const upgradeWrapper = compose(
    traverseWallet(Task.of, upgradeWallet),
    // TODO: SEGWIT remove w/ DEPRECATED_V3
    set(version, 3)
    // set(version, PAYLOAD_VERSION)
  )

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
  payload => crypto.sha256(payload).toString('hex'),
  prop('payload')
)

// fromEncJSON :: String -> JSON -> Task Error Wrapper
export const fromEncJSON = curry((password, json) => {
  let payloadL = lensProp('payload')
  let payloadJsonE = Either.try(JSON.parse)(json.payload)

  // assocIterations :: Number -> Wrapper
  let assocIterations = wrapper =>
    payloadJsonE
      .map(payload =>
        assoc('pbkdf2_iterations', payload.pbkdf2_iterations, wrapper)
      )
      .getOrElse(wrapper)

  // assocVersion :: Wrapper -> Wrapper
  let assocVersion = wrapper =>
    payloadJsonE
      .map(payload => assoc('version', payload.version, wrapper))
      .getOrElse(wrapper)

  // TODO: SEGWIT remove w/ DEPRECATED_V3
  let v
  try {
    v = JSON.parse(json.payload).version
  } catch (e) {
    // eslint-disable-next-line
    v = 3
  }

  return traverseOf(
    payloadL,
    Task.of,
    // TODO: SEGWIT remove w/ DEPRECATED_V3
    (v === 4 ? Wallet : Wallet_DEPRECATED_V3).fromEncryptedPayload(password),
    json
  )
    .map(assocVersion)
    .map(assocIterations)
    .map(o => assoc('wallet', o.payload, o))
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

  return traverseOf(
    lensProp('payload'),
    Task.of,
    // TODO: SEGWIT remove w/ DEPRECATED_V3
    (version === 4 ? Wallet : Wallet_DEPRECATED_V3).fromEncryptedPayload(
      password
    ),
    wrapper
  )
    .map(o => assoc('wallet', o.payload, o))
    .map(dissoc('payload'))
    .map(fromJS)
})

// toEncJSON :: Wrapper -> Either Error JSON
export const toEncJSON = wrapper => {
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  const W = wrapper.version === 4 ? Wallet : Wallet_DEPRECATED_V3
  const plens = lensProp('payload')
  const response = {
    guid: compose(W.selectGuid, selectWallet)(wrapper),
    sharedKey: compose(W.selectSharedKey, selectWallet)(wrapper),
    payload: selectWallet(wrapper),
    old_checksum: selectPayloadChecksum(wrapper),
    language: selectLanguage(wrapper)
  }
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  const encrypt =
    wrapper.version === 4
      ? W.toEncryptedPayload(
          selectPassword(wrapper),
          selectPbkdf2Iterations(wrapper) || 5000,
          selectVersion(wrapper)
        )
      : W.toEncryptedPayload(
          selectPassword(wrapper),
          selectPbkdf2Iterations(wrapper) || 5000
        )
  const hash = x => crypto.sha256(x).toString('hex')
  return traverseOf(plens, Task.of, encrypt, response)
    .map(r => assoc('length', view(plens, r).length, r))
    .map(r => assoc('checksum', hash(view(plens, r)), r))
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
  sync_pubkeys: false,
  payload_checksum: '',
  storage_token: '',
  // version: PAYLOAD_VERSION,
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  version: 3,
  language: language,
  // TODO: SEGWIT remove w/ DEPRECATED_V3
  wallet: Wallet_DEPRECATED_V3.js(
    guid,
    sharedKey,
    label,
    mnemonic,
    nAccounts,
    network
  ),
  war_checksum: '',
  password: password,
  pbkdf2_iterations: 5000
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
) =>
  fromJS(
    js(
      password,
      guid,
      sharedKey,
      firstAccountName,
      mnemonic,
      language,
      nAccounts,
      network
    )
  )

export const createNewReadOnly = (
  xpub,
  firstAccountName = 'My read-only Wallet'
) => fromJS(js('', '', '', firstAccountName, undefined, xpub, 1))
