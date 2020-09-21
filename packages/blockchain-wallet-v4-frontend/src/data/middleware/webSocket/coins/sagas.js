import * as T from 'services/AlertService'
import { actions, selectors } from 'data'
import {
  btcTransaction,
  ethReceivedConfirmed,
  ethReceivedPending,
  ethSentConfirmed,
  header
} from './messageTypes'
import { call, put, select } from 'redux-saga/effects'
import { concat, equals, prop } from 'ramda'
import { Remote, crypto as wCrypto } from 'blockchain-wallet-v4/src'
import { WALLET_TX_SEARCH } from '../../../form/model'

import crypto from 'crypto'

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  )
}

export default ({ api, socket }) => {
  const send = socket.send.bind(socket)

  const pingPhone = function * (ruid, secretHex, phonePubkey, guid) {
    let currentState = yield select(selectors.auth.getSecureChannelLogin)
    if (currentState !== Remote.NotAsked) {
      return
    }
    let msg = {
      type: 'login_wallet',
      ruid: ruid,
      timestamp: Date.now()
    }

    let sharedSecret = wCrypto.deriveSharedSecret(
      Buffer.from(secretHex, 'hex'),
      Buffer.from(phonePubkey, 'hex')
    )
    let encrypted = wCrypto.encryptAESGCM(
      sharedSecret,
      Buffer.from(JSON.stringify(msg), 'utf8')
    )
    let payload = {
      guid: guid,
      pubkeyhash: wCrypto
        .sha256(wCrypto.derivePubFromPriv(Buffer.from(secretHex, 'hex')))
        .toString('hex'),
      message: encrypted.toString('hex')
    }

    yield put(actions.auth.secureChannelLoginLoading())
    yield put(actions.core.data.misc.sendSecureChannelMessage(payload))
  }

  const onOpen = function * () {
    let secretHex = yield select(selectors.cache.getChannelPrivKey)
    let ruid = yield select(selectors.cache.getChannelRuid)

    if (!secretHex || !ruid) {
      secretHex = crypto.randomBytes(32).toString('hex')
      yield put(actions.cache.channelPrivKeyCreated(secretHex))

      ruid = uuidv4()
      yield put(actions.cache.channelRuidCreated(ruid))
    }

    yield call(
      send,
      JSON.stringify({
        command: 'subscribe',
        entity: 'secure_channel',
        param: { ruid: ruid }
      })
    )

    // Also, if we already know a phone, let's ping it to give us it's secrets
    let phonePubkey = yield select(selectors.cache.getPhonePubkey)
    let guid = yield select(selectors.cache.getLastGuid)
    if (phonePubkey && guid) {
      yield pingPhone(ruid, secretHex, phonePubkey, guid)
    }
  }

  const onAuth = function * () {
    try {
      // 1. subscribe to block headers
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'btc' })
      )
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'bch' })
      )
      yield call(
        send,
        JSON.stringify({ command: 'subscribe', entity: 'header', coin: 'eth' })
      )

      // 2. subscribe to btc xpubs
      const btcWalletContext = yield select(selectors.core.data.btc.getContext)
      const btcLockboxContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )).getOrElse([])
      const btcXPubs = concat(btcWalletContext, btcLockboxContext)
      btcXPubs.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'btc',
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
      bchXPubs.forEach(xpub =>
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'xpub',
            coin: 'bch',
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
      ethAddresses.forEach(address => {
        send(
          JSON.stringify({
            command: 'subscribe',
            entity: 'account',
            coin: 'eth',
            param: { address }
          })
        )
      })

      // 5. subscribe wallet guid to get email verification updates
      const subscribeInfo = yield select(
        selectors.core.wallet.getInitialSocketContext
      )
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
        actions.logs.logErrorMessage(
          'middleware/webSocket/coins/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onMessage = function * (action) {
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
            yield put(
              actions.alerts.displayInfo(T.PAYMENT_RECEIVED_ETH_PENDING)
            )
          } else if (ethReceivedConfirmed(message)) {
            yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_ETH))
            yield put(actions.core.data.eth.fetchTransactions(null, true))
            yield put(actions.core.data.eth.fetchData([message.address]))
          }
          break

        default:
          // check if message is an email verification update

          let payload = {}
          try {
            payload = JSON.parse(message.msg)
          } catch (e) {}

          if (payload.ruid) {
            if (!payload.success) {
              // TODO should this be a new action to delete, or is this fine?
              yield put(actions.cache.channelPhoneConnected(undefined))
              yield put(
                actions.auth.secureChannelLoginFailure('Phone declined')
              )
              return
            }

            let secretHex = yield select(selectors.cache.getChannelPrivKey)
            let pubkey = Buffer.from(payload.pubkey, 'hex')
            let sharedSecret = wCrypto.deriveSharedSecret(
              Buffer.from(secretHex, 'hex'),
              pubkey
            )
            let decryptedRaw = wCrypto.decryptAESGCM(
              sharedSecret,
              Buffer.from(payload.message, 'hex')
            )

            let decrypted = JSON.parse(decryptedRaw.toString('utf8'))

            if (decrypted.type === 'handshake') {
              let ruid = yield select(selectors.cache.getChannelRuid)
              yield pingPhone(ruid, secretHex, payload.pubkey, decrypted.guid)
            } else if (decrypted.type === 'login_wallet') {
              if (decrypted.remember) {
                yield put(
                  actions.cache.channelPhoneConnected(pubkey.toString('hex'))
                )
              }

              yield put(actions.auth.secureChannelLoginSuccess())
              yield put(actions.form.change('login', 'guid', decrypted.guid))
              yield put(
                actions.form.change('login', 'password', decrypted.password)
              )
              yield put(actions.form.startSubmit('login'))
              yield put(
                actions.auth.login(
                  decrypted.guid,
                  decrypted.password,
                  undefined,
                  decrypted.sharedKey
                )
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
        actions.logs.logErrorMessage(
          'middleware/webSocket/coins/sagas',
          'onMessage',
          e.message
        )
      )
    }
  }

  const sentOrReceived = function * (coin, message) {
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(
        `${coin} is not a valid coin. sentOrReceived only accepts btc and bch types.`
      )
    const context = yield select(selectors.core.data[coin].getContext)
    const endpoint = coin === 'btc' ? 'fetchBlockchainData' : 'fetchBchData'
    const data = yield call(api[endpoint], context, {
      n: 50,
      offset: 0
    })
    const transactions = data.txs || []

    for (let i in transactions) {
      const transaction = transactions[i]
      if (equals(transaction.hash, message.transaction.hash)) {
        if (transaction.result > 0) return 'received'
        break
      }
    }
    return 'sent'
  }

  const transactionsUpdate = function * (coin) {
    if (coin !== 'btc' && coin !== 'bch')
      throw new Error(
        `${coin} is not a valid coin. transactionsUpdate only accepts btc and bch types.`
      )
    const pathname = yield select(selectors.router.getPathname)
    if (equals(pathname, `/${coin}/transactions`)) {
      const formValues = yield select(
        selectors.form.getFormValues(WALLET_TX_SEARCH)
      )
      const source = prop('source', formValues)
      const onlyShow = equals(source, 'all')
        ? ''
        : prop('xpub', source) || prop('address', source)
      yield put(actions.core.data[coin].fetchTransactions(onlyShow, true))
    }
  }

  const onClose = function * (action) {
    yield put(
      actions.logs.logErrorMessage(
        'middleware/webSocket/coins/sagas',
        'onClose',
        `websocket closed at ${Date.now()}`
      )
    )
  }

  return {
    onOpen,
    onAuth,
    onMessage,
    onClose
  }
}
