import crypto from 'crypto'
import { concat, equals, prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'

import { crypto as wCrypto } from '@core'
import { actions, selectors } from 'data'
import * as T from 'services/alerts'

import { WALLET_TX_SEARCH } from '../../../form/model'
import {
  btcTransaction,
  ethReceivedConfirmed,
  ethReceivedPending,
  ethSentConfirmed,
  header
} from './messageTypes'

export default ({ api, socket }) => {
  const send = socket.send.bind(socket)

  const pingPhone = function* (channelId, secretHex, phonePubKey, guid) {
    const msg = {
      channelId,
      timestamp: Date.now(),
      type: 'login_wallet'
    }

    const sharedSecret = wCrypto.deriveSharedSecret(
      Buffer.from(secretHex, 'hex'),
      Buffer.from(phonePubKey, 'hex')
    )
    const encrypted = wCrypto.encryptAESGCM(sharedSecret, Buffer.from(JSON.stringify(msg), 'utf8'))
    const payload = {
      guid,
      message: encrypted.toString('hex'),
      pubkeyhash: wCrypto
        .sha256(wCrypto.derivePubFromPriv(Buffer.from(secretHex, 'hex')))
        .toString('hex')
    }

    yield put(actions.auth.secureChannelLoginLoading())
    yield put(actions.alerts.displayInfo(T.MOBILE_LOGIN_CONFIRM))
    yield put(actions.core.data.misc.sendSecureChannelMessage(payload))
  }

  const onOpen = function* () {
    let secretHex = yield select(selectors.cache.getChannelPrivKey)
    let channelId = yield select(selectors.cache.getChannelChannelId)

    if (!secretHex || !channelId) {
      secretHex = crypto.randomBytes(32).toString('hex')
      yield put(actions.cache.channelPrivKeyCreated(secretHex))

      channelId = uuidv4()
      yield put(actions.cache.channelChannelIdCreated(channelId))
    }

    yield call(
      send,
      JSON.stringify({
        command: 'subscribe',
        entity: 'secure_channel',
        param: { channelId }
      })
    )
    // Also, if we already know a phone, let's ping it to give us it's secrets
    const phonePubkey = yield select(selectors.cache.getPhonePubkey)
    const guid = yield select(selectors.cache.getLastGuid)
    const lastLogoutTime = yield select(selectors.cache.getLastLogoutTimestamp)

    // only ping phone if last logout time is more than 5 minutes
    // prevents pinging phone again right when user logs out
    const pingPhoneOnLoad = Date.now() - lastLogoutTime > 300000
    if (phonePubkey && guid && pingPhoneOnLoad) {
      yield pingPhone(channelId, secretHex, phonePubkey, guid)
    }
  }

  const onAuth = function* () {
    try {
      // 1. subscribe to block headers
      yield call(send, JSON.stringify({ coin: 'btc', command: 'subscribe', entity: 'header' }))
      yield call(send, JSON.stringify({ coin: 'bch', command: 'subscribe', entity: 'header' }))
      yield call(send, JSON.stringify({ coin: 'eth', command: 'subscribe', entity: 'header' }))

      // 2. subscribe to btc xpubs
      const btcWalletContext = yield select(selectors.core.data.btc.getContext)
      // context has separate bech32 ,legacy, and imported address arrays
      const btcWalletXPubs = prop('legacy', btcWalletContext).concat(
        prop('addresses', btcWalletContext),
        prop('bech32', btcWalletContext)
      )

      const btcLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )).getOrElse([])
      const btcXPubs = concat(btcWalletXPubs, btcLockboxContext)
      btcXPubs.forEach((xpub) =>
        send(
          JSON.stringify({
            coin: 'btc',
            command: 'subscribe',
            entity: 'xpub',
            param: { address: xpub }
          })
        )
      )

      // 3. subscribe to bch xpubs
      const bchWalletContext = yield select(selectors.core.data.bch.getContext)
      const bchLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBchContext
      )).getOrElse([])
      const bchXPubs = concat(bchWalletContext, bchLockboxContext)
      bchXPubs.forEach((xpub) =>
        send(
          JSON.stringify({
            coin: 'bch',
            command: 'subscribe',
            entity: 'xpub',
            param: { address: xpub }
          })
        )
      )

      // 4. subscribe to ethereum addresses
      const ethWalletContext = yield select(selectors.core.data.eth.getContext)
      const ethLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxEthContext
      )).getOrElse([])
      const ethAddresses = concat(ethWalletContext, ethLockboxContext)
      ethAddresses.forEach((address) => {
        send(
          JSON.stringify({
            coin: 'eth',
            command: 'subscribe',
            entity: 'account',
            param: { address }
          })
        )
      })

      // 5. subscribe wallet guid to get email verification updates
      const subscribeInfo = yield select(selectors.core.wallet.getInitialSocketContext)
      const guid = prop('guid', subscribeInfo)
      yield call(
        send,
        JSON.stringify({
          command: 'subscribe',
          entity: 'wallet',
          param: { guid }
        })
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage('middleware/webSocket/coins/sagas', 'onOpen', e.message)
      )
    }
  }

  const sentOrReceived = function* (coin, message) {
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(`${coin} is not a valid coin. sentOrReceived only accepts btc and bch types.`)
    const context = yield select(selectors.core.data[coin].getContext)
    const endpoint = coin === 'btc' ? 'fetchBlockchainData' : 'fetchBchData'
    const data = yield call(api[endpoint], context, {
      n: 50,
      offset: 0
    })
    const transactions = data.txs || []

    // eslint-disable-next-line
    for (let i in transactions) {
      const transaction = transactions[i]
      if (equals(transaction.hash, message.transaction.hash)) {
        if (transaction.result > 0) return 'received'
        break
      }
    }

    return 'sent'
  }

  const transactionsUpdate = function* (coin) {
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(
        `${coin} is not a valid coin. transactionsUpdate only accepts btc and bch types.`
      )
    yield put(actions.components.buySell.fetchBalance({ isLoading: true }))
    const pathname = yield select(selectors.router.getPathname)
    if (equals(pathname, `/${coin}/transactions`)) {
      const formValues = yield select(selectors.form.getFormValues(WALLET_TX_SEARCH))
      const source = prop('source', formValues)
      const onlyShow = equals(source, 'all') ? '' : prop('xpub', source) || prop('address', source)
      yield put(actions.core.data[coin].fetchTransactions(onlyShow, true))
    }
  }

  const onMessage = function* (action) {
    const message = prop('payload', action)
    try {
      switch (message.coin) {
        case 'btc':
          if (header(message)) {
            const header = prop('header', message)
            yield put(
              actions.core.data.btc.setBtcLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (btcTransaction(message)) {
            const direction = yield sentOrReceived('btc', message)
            if (direction === 'received') {
              yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BTC))
            }
            // refresh data
            yield put(actions.core.data.btc.fetchData())
            // if on transactions page, update
            yield transactionsUpdate('btc')
          }
          break

        case 'bch':
          if (header(message)) {
            const header = prop('header', message)
            yield put(
              actions.core.data.bch.setBCHLatestBlock(
                header.blockIndex,
                header.hash,
                header.height,
                header.time
              )
            )
          } else if (btcTransaction(message)) {
            const direction = yield sentOrReceived('bch', message)
            if (direction === 'received') {
              yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_BCH))
            }
            // refresh data
            yield put(actions.core.data.bch.fetchData())
            // if on transactions page, update
            yield transactionsUpdate('bch')
          }
          break

        case 'eth':
          if (header(message)) {
            const header = prop('header', message)
            yield put(actions.core.data.eth.fetchLatestBlockSuccess(header))
          } else if (ethSentConfirmed(message)) {
            yield put(
              actions.alerts.displaySuccess(T.SEND_COIN_CONFIRMED, {
                coinName: 'Ethereum'
              })
            )
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          } else if (ethReceivedPending(message)) {
            yield put(actions.alerts.displayInfo(T.PAYMENT_RECEIVED_ETH_PENDING))
            yield put(actions.components.buySell.fetchBalance({ skipLoading: true }))
          } else if (ethReceivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          }
          break

        default:
          // check if message is an email verification update

          let payload = {}
          // secure channel/mobile app login data is recevied as a JSON
          // this is why we're parsing message.msg first and assigining it
          // to payload
          try {
            if (message.msg) {
              payload = JSON.parse(message.msg)
            }
          } catch (e) {
            console.error(e)
          }

          if (payload.channelId) {
            if (!payload.success) {
              yield put(actions.cache.channelPhoneConnected(undefined))
              yield put(actions.auth.secureChannelLoginFailure('Phone declined'))
              yield put(actions.alerts.displayError(T.MOBILE_LOGIN_DECLINED))
              return
            }

            const secretHex = yield select(selectors.cache.getChannelPrivKey)
            const pubkey = Buffer.from(payload.pubkey, 'hex')
            const sharedSecret = wCrypto.deriveSharedSecret(Buffer.from(secretHex, 'hex'), pubkey)
            const decryptedRaw = wCrypto.decryptAESGCM(
              sharedSecret,
              Buffer.from(payload.message, 'hex')
            )

            const decrypted = JSON.parse(decryptedRaw.toString('utf8'))

            if (decrypted.type === 'handshake') {
              const channelId = yield select(selectors.cache.getChannelChannelId)
              yield pingPhone(channelId, secretHex, payload.pubkey, decrypted.guid)
            } else if (decrypted.type === 'login_wallet') {
              if (decrypted.remember) {
                yield put(actions.cache.channelPhoneConnected(pubkey.toString('hex')))
              }
              yield put(actions.auth.secureChannelLoginSuccess())
              yield put(actions.alerts.displaySuccess(T.MOBILE_LOGIN_SUCCESS))
              yield put(actions.form.change('login', 'guid', decrypted.guid))
              yield put(actions.form.change('login', 'password', decrypted.password))
              yield put(actions.form.startSubmit('login'))
              yield put(
                actions.auth.login({
                  code: undefined,
                  guid: decrypted.guid,
                  password: decrypted.password,
                  sharedKey: decrypted.sharedKey
                })
              )
            }
          }

          if (!!message.email && message.isVerified) {
            yield put(actions.core.settings.setEmailVerified())
            yield put(actions.alerts.displaySuccess(T.EMAIL_VERIFY_SUCCESS))
          }
          break
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage('middleware/webSocket/coins/sagas', 'onMessage', e.message)
      )
    }
  }

  const onClose = function* () {
    yield put(
      actions.logs.logErrorMessage(
        'middleware/webSocket/coins/sagas',
        'onClose',
        `websocket closed at ${Date.now()}`
      )
    )
  }

  const resendMessageSocket = function* () {
    const secretHex = yield select(selectors.cache.getChannelPrivKey)
    const channelId = yield select(selectors.cache.getChannelChannelId)
    const phonePubKey = yield select(selectors.cache.getPhonePubkey)
    const guid = yield select(selectors.cache.getLastGuid)
    yield pingPhone(channelId, secretHex, phonePubKey, guid)
  }

  return {
    onAuth,
    onClose,
    onMessage,
    onOpen,
    resendMessageSocket
  }
}
