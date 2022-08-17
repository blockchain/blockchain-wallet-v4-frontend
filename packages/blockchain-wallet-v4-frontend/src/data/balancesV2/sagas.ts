import { all, call, put, select } from '@redux-saga/core/effects'
import BigNumber from 'bignumber.js'
import BIP39 from 'bip39-light'
import * as Bitcoin from 'bitcoinjs-lib'
import { ethers } from 'ethers'

import { APIType } from '@core/network/api'
import { SubscribeRequestType } from '@core/network/api/coins/types'
import { getMnemonic } from '@core/redux/data/self-custody/sagas'
import { errorHandler } from '@core/utils'
import { getKeyPair } from '@core/utils/xlm'
import { sha256 } from '@core/walletCrypto'
import { selectors } from 'data'

import { actions as A } from './slice'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas; networks }) => {
  const getAuth = function* () {
    const guid = yield select(selectors.core.wallet.getGuid)
    const sharedKey = yield select(selectors.core.wallet.getSharedKey)

    const guidHash = sha256(guid).toString('hex')
    const sharedKeyHash = sha256(sharedKey).toString('hex')

    return { guidHash, sharedKeyHash }
  }

  // initialize subscriptions
  // derive all non custodial coin accounts, subscribe and check activity
  // if the user has activity on the coin, subscribe it
  // otherwise ubsubscribe
  const initializeSubscriptions = function* () {
    try {
      const { guidHash, sharedKeyHash } = yield call(getAuth)
      const mnemonic = yield call(getMnemonic)
      const seed = BIP39.mnemonicToSeed(mnemonic)
      const accounts = [] as SubscribeRequestType['data']

      // BTC
      const btcAccounts = selectors.core.wallet.getHDAccounts(yield select())
      btcAccounts.forEach((btcAccount) => {
        if (btcAccount.archived) return
        btcAccount.derivations.forEach((derivation) => {
          accounts.push({
            account: {
              index: btcAccount.index,
              name: btcAccount.label
            },
            currency: 'BTC',
            pubKeys: [
              {
                descriptor: derivation.type === 'bech32' ? 1 : 0,
                pubKey: derivation.xpub,
                style: 'EXTENDED'
              }
            ]
          } as SubscribeRequestType['data'][0])
        })
      })

      // BCH
      const bchAccounts = selectors.core.kvStore.bch.getAccounts(yield select()).getOrElse([])
      bchAccounts.forEach((bchAccount, i) => {
        if (bchAccount.archived) return
        const { xpub } = btcAccounts
          .find(({ index }) => index === i)
          .derivations.find(({ type }) => type === 'legacy')
        accounts.push({
          account: {
            index: i,
            name: bchAccount.label
          },
          currency: 'BCH',
          pubKeys: [
            {
              descriptor: 0,
              pubKey: xpub,
              style: 'EXTENDED'
            }
          ]
        })
      })

      // ETH
      const ethAccount = selectors.core.kvStore.eth
        .getDefaultAccount(yield select())
        .getOrFail('No eth account')
      const { label } = ethAccount
      const { publicKey: ethPublicKey } = Bitcoin.bip32
        .fromSeed(seed)
        .derivePath(`m/44'/60'/0'/0/0`)
      accounts.push({
        account: {
          index: 0,
          name: label
        },
        currency: 'ETH',
        pubKeys: [
          {
            descriptor: 0,
            pubKey: ethPublicKey.toString('hex'),
            style: 'SINGLE'
          }
        ]
      })

      // XLM
      const xlmKeyPair = yield call(getKeyPair, mnemonic)
      accounts.push({
        account: {
          index: 0,
          name: 'Private Key Wallet'
        },
        currency: 'XLM',
        pubKeys: [
          { descriptor: 0, pubKey: xlmKeyPair.rawPublicKey().toString('hex'), style: 'SINGLE' }
        ]
      })

      // STX
      const { publicKey: stxPubKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0/0`)
      accounts.push({
        account: {
          index: 0,
          name: 'Private Key Wallet'
        },
        currency: 'STX',
        pubKeys: [{ descriptor: 0, pubKey: stxPubKey.toString('hex'), style: 'SINGLE' }]
      })

      yield call(api.subscribe, {
        auth: { guidHash, sharedKeyHash },
        data: accounts
      })

      const fiatCurrency = selectors.core.settings.getCurrency(yield select()).getOrElse('USD')
      // Check for balances
      const balances: ReturnType<typeof api.fetchUnifiedBalances> = yield call(
        api.fetchUnifiedBalances,
        {
          fiatCurrency,
          guidHash,
          sharedKeyHash
        }
      )
      const filteredBalances = balances
      // If no balance unsubscribe coin
      yield all(
        balances.currencies.map(function* (res) {
          const siblingAccounts = balances.currencies.filter(({ ticker }) => ticker === res.ticker)
          const someBalance = siblingAccounts.some(({ amount }) =>
            new BigNumber(amount.amount).isGreaterThan(0)
          )
          if (!someBalance) {
            yield put(A.unsubscribe(res.ticker))
            filteredBalances.currencies.filter(({ ticker }) => ticker !== res.ticker)
          }
        })
      )
      yield put(A.fetchUnifiedBalancesSuccess(filteredBalances.currencies))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchUnifiedBalancesFailure(error))
    }
  }

  const unsubscribe = function* (action: ReturnType<typeof A.unsubscribe>) {
    const { guidHash, sharedKeyHash } = yield call(getAuth)
    try {
      yield call(api.unsubscribe, { currency: action.payload, guidHash, sharedKeyHash })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  const fetchUnifiedBalances = function* () {
    try {
      yield put(A.fetchUnifiedBalancesLoading())
      const { guidHash, sharedKeyHash } = yield call(getAuth)
      const fiatCurrency = selectors.core.settings.getCurrency(yield select()).getOrElse('USD')
      const balances: ReturnType<typeof api.fetchUnifiedBalances> = yield call(
        api.fetchUnifiedBalances,
        {
          fiatCurrency,
          guidHash,
          sharedKeyHash
        }
      )
      yield put(A.fetchUnifiedBalancesSuccess(balances.currencies))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchUnifiedBalancesFailure(error))
    }
  }

  return {
    fetchUnifiedBalances,
    initializeSubscriptions,
    unsubscribe
  }
}
