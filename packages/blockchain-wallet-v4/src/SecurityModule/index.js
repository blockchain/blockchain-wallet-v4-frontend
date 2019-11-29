// Functions that require sensitive information to perform (e.g., password,
// seed, and sharedKey).  Think of this module as similar to a Hardware Security
// Module.

import BIP39 from 'bip39'
import Bitcoin from 'bitcoinjs-lib'
import * as ed25519 from 'ed25519-hd-key'
import EthHd from 'ethereumjs-wallet/hdkey'

import * as selectors from '../redux/wallet/selectors'
import Core from './core'
import * as types from '../types'
import { taskToPromise } from '../utils/functional'
import * as crypto from '../walletCrypto'

const core = Core({ BIP39, Bitcoin, crypto, ed25519, EthHd })

export default ({ store }) => {
  const getSeedHex = ({ secondPassword }) => {
    const state = store.getState()
    const wallet = selectors.getWallet(state)
    return taskToPromise(types.Wallet.getSeedHex(secondPassword, wallet))
  }

  const generateCredentialsEntropy = ({ guid, sharedKey }) => {
    const state = store.getState()
    const password = selectors.getMainPassword(state)
    return core.generateCredentialsEntropy({ guid, password, sharedKey })
  }

  const deriveBIP32Key = async ({ network, secondPassword }, path) => {
    const entropy = await getSeedHex({ secondPassword })
    return core.deriveBIP32KeyFromSeedHex({ entropy, network }, path)
  }

  // Derivation error using seedHex directly instead of seed derived from
  // mnemonic derived from seedHex
  const deriveLegacyEthereumKey = async ({ secondPassword }) => {
    const entropy = await getSeedHex({ secondPassword })
    return core.deriveLegacyEthereumKey({ entropy })
  }

  const deriveSLIP10ed25519Key = async ({ secondPassword }, path) => {
    const entropy = await getSeedHex({ secondPassword })
    return core.deriveSLIP10ed25519Key({ entropy }, path)
  }

  const generateMatomoUserId = () => {
    const state = store.getState()
    const { seedHex } = selectors.getDefaultHDWallet(state)
    return core.generateMatomoUserId({ seedHex })
  }

  return {
    generateCredentialsEntropy,
    deriveBIP32Key,
    deriveLegacyEthereumKey,
    deriveSLIP10ed25519Key,
    generateMatomoUserId
  }
}
