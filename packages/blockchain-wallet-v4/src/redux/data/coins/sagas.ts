import { BigNumber } from 'bignumber.js'
import BIP39 from 'bip39-light'
import * as Bitcoin from 'bitcoinjs-lib'
import { getTime } from 'date-fns'
import { flatten, last, length } from 'ramda'
import { all, call, delay, put, select, take } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { AuthDataType, SourceStyleType, SubscribeAccountType } from '@core/network/api/coins/types'
import { getMnemonic, getPubKey } from '@core/redux/data/self-custody/sagas'
import { FetchCustodialOrdersAndTransactionsReturnType } from '@core/types'
import { errorHandler } from '@core/utils'
import { getKeyPair } from '@core/utils/xlm'
import { sha256 } from '@core/walletCrypto'

import Remote from '../../../remote'
import * as selectors from '../../selectors'
import custodialSagas from '../custodial/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

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

  const fetchCoinData = function* (action: ReturnType<typeof A.fetchData>) {
    const { list, password } = action.payload

    try {
      // TODO: SELF_CUSTODY
      // this 'list' will eventually come from wallet-agent
      const coins = list || ['STX']
      yield all(
        coins.map(function* (coin) {
          const pubKey = yield call(getPubKey, password)
          try {
            const { results }: ReturnType<typeof api.balance> = yield call(api.balance, [
              { descriptor: 'legacy', pubKey, style: 'SINGLE' }
            ])

            // const { currencies } = yield call(api.getUnifiedBalances, {})
            console.log({ results })
            // TODO: SELF_CUSTODY
            yield put(
              A.fetchDataSuccess(
                coin,
                results[0].balances
                  .reduce((acc, curr) => acc.plus(curr.amount), new BigNumber(0))
                  .toString()
              )
            )
          } catch (e) {
            const error = errorHandler(e)
            yield put(A.fetchDataFailure(error, coin))
          }
        })
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
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
      yield put(A.fetchCoinsRatesSuccess(response))
    } catch (e) {
      const error =
        typeof errorHandler(e) === 'string' ? errorHandler(e) : 'Failed to fetch prices.'
      yield put(A.fetchCoinsRatesFailure(error))
    }
  }

  const fetchTransactions = function* (action: ReturnType<typeof A.fetchTransactions>) {
    const { payload } = action
    const { coin, reset } = payload
    try {
      const pages = S.getTransactions(coin, yield select())
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = S.getTransactionsAtBound(coin, yield select())
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(coin, reset))
      const txs: Array<any> = []
      const txPage: Array<any> = txs
      const nextBSTransactionsURL = selectors.data.custodial.getNextBSTransactionsURL(
        yield select(),
        coin
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        true,
        coin,
        reset ? null : nextBSTransactionsURL
      )
      const txList = [txPage, custodialPage.orders]
      const auth = yield call(getAuth)
      if (window.coins[coin].coinfig.products.includes('DynamicSelfCustody')) {
        const pubKey = yield call(getPubKey, '')
        const addres: ReturnType<typeof api.getAddresses> = yield call(api.getAddresses, {
          auth,
          currencies: [
            {
              memo: '',
              ticker: coin
            }
          ]
        })
        const { results }: ReturnType<typeof api.deriveAddress> = yield call(api.deriveAddress, {
          coin,
          pubkey: pubKey
        })
        const addresses = results.map(({ address }) => address)
        const selfCustodyPage: ReturnType<typeof api.txHistory> = yield call(api.txHistory, [
          { descriptor: 'default', pubKey, style: 'SINGLE' }
        ])
        const history = selfCustodyPage.history.map((val) => {
          const type = addresses.includes(
            val.movements.find(({ type }) => type === 'SENT')?.address || ''
          )
            ? 'SENT'
            : 'RECEIVED'
          return {
            ...val,
            amount: val.movements.find(({ type }) => type === 'SENT')?.amount,
            from: val.movements.find(({ type }) => type === 'SENT')?.address,
            insertedAt: val.timestamp,
            to: val.movements.find(({ type }) => type === 'RECEIVED')?.address,
            type
          }
        })
        txList.push(history)
      }
      const newPages = flatten([txList])
      const page = newPages.sort((a, b) => {
        if (a.insertedAt === null) return -1
        if (b.insertedAt === null) return 1
        return getTime(new Date(b.insertedAt)) - getTime(new Date(a.insertedAt))
      })
      const atBounds = page.length < TX_PER_PAGE * newPages.length
      yield put(A.transactionsAtBound(coin, atBounds))
      yield put(A.fetchTransactionsSuccess(coin, page, reset, true))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTransactionsFailure(coin, error))
    }
  }

  const initializeSubscriptions = function* () {
    try {
      const { guidHash, sharedKeyHash }: AuthDataType = yield call(getAuth)
      const mnemonic = yield call(getMnemonic)
      const seed = BIP39.mnemonicToSeed(mnemonic)
      const accounts = [] as SubscribeAccountType[]

      // BTC
      const btcAccounts = selectors.wallet.getHDAccounts(yield select())
      btcAccounts.forEach((btcAccount) => {
        if (btcAccount.archived) return
        btcAccount.derivations.forEach(({ type, xpub }) => {
          accounts.push({
            account: {
              index: btcAccount.index,
              name: btcAccount.label
            },
            currency: 'BTC',
            pubKeys: [
              {
                descriptor: type === 'bech32' ? 1 : 0,
                pubKey: xpub,
                style: SourceStyleType.EXTENDED
              }
            ]
          } as SubscribeAccountType)
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
              style: SourceStyleType.EXTENDED
            }
          ]
        } as SubscribeAccountType)
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
            style: SourceStyleType.SINGLE
          }
        ]
      } as SubscribeAccountType)

      // MATIC
      accounts.push({
        account: {
          index: 0,
          name: label
        },
        currency: 'MATIC.MATIC',
        pubKeys: [
          {
            descriptor: 0,
            pubKey: ethPublicKey.toString('hex'),
            style: SourceStyleType.SINGLE
          }
        ]
      } as SubscribeAccountType)

      // XLM
      const xlmKeyPair = yield call(getKeyPair, mnemonic)
      accounts.push({
        account: {
          index: 0,
          name: 'Private Key Wallet'
        },
        currency: 'XLM',
        pubKeys: [
          {
            descriptor: 0,
            pubKey: xlmKeyPair.rawPublicKey().toString('hex'),
            style: SourceStyleType.SINGLE
          }
        ]
      } as SubscribeAccountType)

      // STX
      const { publicKey: stxPubKey } = Bitcoin.bip32.fromSeed(seed).derivePath(`m/44'/5757'/0'/0/0`)
      accounts.push({
        account: {
          index: 0,
          name: 'Private Key Wallet'
        },
        currency: 'STX',
        pubKeys: [
          { descriptor: 0, pubKey: stxPubKey.toString('hex'), style: SourceStyleType.SINGLE }
        ]
      } as SubscribeAccountType)

      yield call(api.subscribe, {
        auth: { guidHash, sharedKeyHash },
        data: accounts
      })

      const fiatCurrency = selectors.settings.getCurrency(yield select()).getOrElse('USD')
      // Check for balances
      // const balances: ReturnType<typeof api.fetchUnifiedBalances> = yield call(
      //   api.fetchUnifiedBalances,
      //   {
      //     fiatCurrency,
      //     guidHash,
      //     sharedKeyHash
      //   }
      // )
      // // Maybe also check for transaction history
      // // Have to make an api call for each coin
      // const filteredBalances = balances
      // // If no balance unsubscribe coin
      // yield all(
      //   balances.currencies.map(function* (res) {
      //     const siblingAccounts = balances.currencies.filter(({ ticker }) => ticker === res.ticker)
      //     const someBalance = siblingAccounts.some(({ amount }) =>
      //       new BigNumber(amount?.amount || 0).isGreaterThan(0)
      //     )
      //     if (!someBalance) {
      //       yield put(A.unsubscribe(res.ticker))
      //       filteredBalances.currencies.filter(({ ticker }) => ticker !== res.ticker)
      //     }
      //   })
      // )
      // yield put(A.fetchUnifiedBalancesSuccess(filteredBalances.currencies))
    } catch (e) {
      const error = errorHandler(e)
      // yield put(A.fetchUnifiedBalancesFailure(error))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_COINS_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  return {
    fetchCoinData,
    fetchCoinsRates,
    fetchTransactions,
    initializeSubscriptions,
    pollForCoinData,
    watchTransactions
  }
}
