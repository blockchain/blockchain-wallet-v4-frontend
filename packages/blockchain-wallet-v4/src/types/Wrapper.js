import { is, curry, lensProp, pipe, compose, assoc, dissoc, prop } from 'ramda'
import { traverseOf, view, over, set } from 'ramda-lens'
import Either from 'data.either'
import Task from 'data.task'

import * as crypto from '../walletCrypto'
import Type from './Type'
import * as Wallet from './Wallet'
import * as Options from './Options'

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

// traverseWallet :: Monad m => (a -> m a) -> (Wallet -> m Wallet) -> Wrapper
export const traverseWallet = curry((of, f, wrapper) =>
  of(wrapper).chain(traverseOf(wallet, of, f))
)

// fromJS :: JSON -> wrapper
export const fromJS = x => {
  if (isWrapper(x)) {
    return x
  }
  const wrapperCons = compose(over(wallet, Wallet.fromJS))
  return wrapperCons(new Wrapper(x))
}

// toJS :: wrapper -> JSON
export const toJS = pipe(
  Wrapper.guard,
  wrapper => {
    const wrapperDecons = over(wallet, Wallet.toJS)
    return wrapperDecons(wrapper).toJS()
  }
)

export const reviver = jsObject => {
  return new Wrapper(jsObject)
}

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

  return traverseOf(
    payloadL,
    Task.of,
    Wallet.fromEncryptedPayload(password),
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
  const temp = JSON.parse(payload)
  const pbkdf2Iterations = prop('pbkdf2_iterations', temp)
  const version = prop('version', temp)
  const wrapper = { password, payload, pbkdf2Iterations, version }
  return traverseOf(
    lensProp('payload'),
    Task.of,
    Wallet.fromEncryptedPayload(password),
    wrapper
  )
    .map(o => assoc('wallet', o.payload, o))
    .map(dissoc('payload'))
    .map(fromJS)
})

// toEncJSON :: Wrapper -> Either Error JSON
export const toEncJSON = wrapper => {
  const plens = lensProp('payload')
  const response = {
    guid: compose(
      Wallet.selectGuid,
      selectWallet
    )(wrapper),
    sharedKey: compose(
      Wallet.selectSharedKey,
      selectWallet
    )(wrapper),
    payload: selectWallet(wrapper),
    old_checksum: selectPayloadChecksum(wrapper),
    language: selectLanguage(wrapper)
  }
  const encrypt = Wallet.toEncryptedPayload(
    selectPassword(wrapper),
    selectPbkdf2Iterations(wrapper) || 5000
  )
  const hash = x => crypto.sha256(x).toString('hex')
  return traverseOf(plens, Task.of, encrypt, response)
    .map(r => assoc('length', view(plens, r).length, r))
    .map(r => assoc('checksum', hash(view(plens, r)), r))
}

export const js = (
  password,
  guid,
  sharedKey,
  label,
  mnemonic,
  xpub,
  language,
  nAccounts = 1,
  network
) => ({
  sync_pubkeys: false,
  payload_checksum: '',
  storage_token: '',
  version: 3,
  language: language,
  wallet: Wallet.js(guid, sharedKey, label, mnemonic, xpub, nAccounts, network),
  war_checksum: '',
  password: password,
  pbkdf2_iterations: 5000
})

export const setBothPbkdf2Iterations = curry((iterations, wrapper) =>
  compose(
    set(
      compose(
        wallet,
        Wallet.options,
        Options.pbkdf2Iterations
      ),
      iterations
    ),
    set(pbkdf2Iterations, iterations)
  )(wrapper)
)

export const createNew = (
  guid,
  password,
  sharedKey,
  mnemonic,
  language,
  firstAccountName = 'My Bitcoin Wallet',
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
      undefined,
      language,
      nAccounts,
      network
    )
  )

export const createNewReadOnly = (
  xpub,
  firstAccountName = 'My read-only Wallet'
) => fromJS(js('', '', '', firstAccountName, undefined, xpub, 1))
