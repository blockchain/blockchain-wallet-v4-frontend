import BigNumber from 'bignumber.js'
import BIP39 from 'bip39-light'
import * as Bitcoin from 'bitcoinjs-lib'
import { getTime } from 'date-fns'
import { flatten, last, length } from 'ramda'
import { all, call, delay, put, select, take } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { SubscribeRequestType } from '@core/network/api/coins/types'
import { getMnemonic, getPubKey } from '@core/redux/data/self-custody/sagas'
import { FetchCustodialOrdersAndTransactionsReturnType } from '@core/types'
import { errorHandler } from '@core/utils'
import { getKeyPair } from '@core/utils/xlm'
import { sha256 } from '@core/walletCrypto'

import Remote from '../../../remote'
import * as selectors from '../../selectors'
import custodialSagas from '../custodial/sagas'
import * as S from './selectors'
import { actions as A } from './slice'

const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })

  const getAuth = function* () {
    const guid = yield select(selectors.wallet.getGuid)
    const sharedKey = yield select(selectors.wallet.getSharedKey)

    const guidHash = sha256(guid).toString('hex')
    const sharedKeyHash = sha256(sharedKey).toString('hex')

    return { guidHash, sharedKeyHash }
  }

  // checks for existence of window.coins data and sets an is loaded flag on state
  const pollForCoinData = function* () {
    try {
      let callCount = 0

      // wait for coin data for upto 10 seconds before throwing error
      while (true) {
        callCount += 1
        if (Object.keys(window.coins || {}).length) break
        if (callCount > 100) throw new Error('load timeout exceeded')
        yield delay(250)
      }
      yield put(A.setCoinDataLoaded())
    } catch (e) {
      const errorRoute = '#app-error?error=errorAssetsApi'
      // manually route to error/maintenance page
      if (window.history.replaceState) {
        window.history.replaceState(null, '', errorRoute)
      } else {
        window.location.hash = errorRoute
      }
      // eslint-disable-next-line no-console
      console.log(`Failed to fetch window.coins: ${e}`)
    }
  }

  const fetchCoinsRates = function* () {
    const coins = S.getAllCoins()
    const defaultFiat = (yield select(selectors.settings.getCurrency)).getOrElse('USD')

    const request = coins.map((coin) => ({
      base: coin,
      quote: defaultFiat
    }))

    try {
      yield put(A.fetchBtcTickerLoading())
      const response: ReturnType<typeof api.getBtcTicker> = yield call(api.getBtcTicker)
      yield put(A.fetchBtcTickerSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchBtcTickerFailure(error))
    }

    try {
      yield put(A.fetchCoinsRatesLoading())
      const response: ReturnType<typeof api.getCoinPrices> = yield call(api.getCoinPrices, request)
      yield put(A.fetchCoinsRatesSuccess({ rates: response }))
    } catch (e) {
      const error =
        typeof errorHandler(e) === 'string' ? errorHandler(e) : 'Failed to fetch prices.'
      yield put(A.fetchCoinsRatesFailure(error))
    }
  }

  const fetchTransactions = function* (action: ReturnType<typeof A.fetchTransactions>) {
    const { payload } = action
    try {
      const { reset } = payload
      const { guidHash, sharedKeyHash } = yield call(getAuth)
      const pages = S.getTransactions(payload.coin, yield select())
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = S.getTransactionsAtBound(payload.coin, yield select())
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading({ coin: payload.coin, reset }))
      const txs: Array<any> = []
      const txPage: Array<any> = txs
      const nextBSTransactionsURL = selectors.data.custodial.getNextBSTransactionsURL(
        yield select(),
        payload.coin
      )
      const fiatCurrency = selectors.settings.getCurrency(yield select()).getOrElse('USD')
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        true,
        payload.coin,
        reset ? null : nextBSTransactionsURL
      )
      const txList = [txPage, custodialPage.orders]
      if (window.coins[payload.coin].coinfig.products.includes('DynamicSelfCustody')) {
        const selfCustodyPage: ReturnType<typeof api.txHistory> = yield call(api.txHistory, {
          currencies: [{ ticker: payload.coin }],
          fiatCurrency,
          guidHash,
          sharedKeyHash
        })
        txList.push(selfCustodyPage.activity)
      }
      const newPages = flatten([txList])
      const page = newPages.sort((a, b) => {
        if (a.insertedAt === null) return -1
        if (b.insertedAt === null) return 1
        return getTime(new Date(b.insertedAt)) - getTime(new Date(a.insertedAt))
      })
      const atBound = page.length < TX_PER_PAGE * newPages.length
      yield put(A.setTransactionsAtBound({ atBound, coin: payload.coin }))
      yield put(A.fetchTransactionsSuccess({ coin: payload.coin, transactions: page }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTransactionsFailure({ coin: payload.coin, error }))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(A.fetchTransactions.type)
      yield call(fetchTransactions, action)
    }
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
      const btcAccounts = selectors.wallet.getHDAccounts(yield select())
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
      const bchAccounts = selectors.kvStore.bch.getAccounts(yield select()).getOrElse([])
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
      const ethAccount = selectors.kvStore.eth
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

      // MATIC
      accounts.push({
        account: {
          index: 0,
          name: label
        },
        currency: 'MATIC',
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

      const fiatCurrency = selectors.settings.getCurrency(yield select()).getOrElse('USD')
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
            new BigNumber(amount?.amount || 0).isGreaterThan(0)
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

  const fetchUnifiedBalances = function* () {
    try {
      yield put(A.fetchUnifiedBalancesLoading())
      const { guidHash, sharedKeyHash } = yield call(getAuth)
      const fiatCurrency = selectors.settings.getCurrency(yield select()).getOrElse('USD')
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

  const unsubscribe = function* (action: ReturnType<typeof A.unsubscribe>) {
    const { guidHash, sharedKeyHash } = yield call(getAuth)
    try {
      yield call(api.unsubscribe, { currency: action.payload, guidHash, sharedKeyHash })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  const subscribe = function* (action: ReturnType<typeof A.subscribe>) {
    const { payload } = action
    const { guidHash, sharedKeyHash } = yield call(getAuth)
    const accounts = [] as SubscribeRequestType['data']
    const mnemonic = yield call(getMnemonic)
    const seed = BIP39.mnemonicToSeed(mnemonic)
    const ethAccount = selectors.kvStore.eth
      .getDefaultAccount(yield select())
      .getOrFail('No eth account')
    const { label } = ethAccount
    const { publicKey: ethPublicKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/60'/0'/0/0`)
    switch (payload.baseCoin) {
      case 'BTC':
        const btcAccounts = selectors.wallet.getHDAccounts(yield select())
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
        break
      case 'BCH':
        const bchAccounts = selectors.kvStore.bch.getAccounts(yield select()).getOrElse([])
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
        break
      case 'ETH':
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
        break
      case 'MATIC':
        accounts.push({
          account: {
            index: 0,
            name: label
          },
          currency: 'MATIC',
          pubKeys: [
            {
              descriptor: 0,
              pubKey: ethPublicKey.toString('hex'),
              style: 'SINGLE'
            }
          ]
        })
        break
      case 'STX':
        const { publicKey: stxPubKey } = Bitcoin.bip32
          .fromSeed(seed)
          .derivePath(`m/44'/5757'/0'/0/0`)
        accounts.push({
          account: {
            index: 0,
            name: 'Private Key Wallet'
          },
          currency: 'STX',
          pubKeys: [{ descriptor: 0, pubKey: stxPubKey.toString('hex'), style: 'SINGLE' }]
        })
        break
      case 'XLM':
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
        break
      default:
        break
    }
    try {
      if (accounts.length)
        yield call(api.subscribe, { auth: { guidHash, sharedKeyHash }, data: accounts })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  return {
    fetchCoinsRates,
    fetchTransactions,
    fetchUnifiedBalances,
    getAuth,
    initializeSubscriptions,
    pollForCoinData,
    subscribe,
    unsubscribe,
    watchTransactions
  }
}
