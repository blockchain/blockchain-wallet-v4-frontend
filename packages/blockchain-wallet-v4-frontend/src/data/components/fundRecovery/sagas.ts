import * as Bitcoin from 'bitcoinjs-lib'
// eslint-disable-next-line
import Task from 'data.task'
import { call, put, select } from 'redux-saga/effects'

import { crypto } from 'blockchain-wallet-v4/src'
import { selectAll } from 'blockchain-wallet-v4/src/coinSelection'
import * as Coin from 'blockchain-wallet-v4/src/coinSelection/coin'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'
import { signSelection as bchSign } from 'blockchain-wallet-v4/src/signer/bch'
import { signSelection as btcSign } from 'blockchain-wallet-v4/src/signer/btc'
import { HDAccountList, Wallet } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { fromCashAddr, toCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import { actions, selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

import * as A from './actions'

export default ({ api }: { api: APIType }) => {
  // const logLocation = 'components/fundRecovery/sagas'
  const network = Bitcoin.networks.bitcoin
  const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

  const recoverFunds = function* (action: ReturnType<typeof A.recoverFunds>) {
    const { payload } = action
    const {
      accountIndex,
      badChange,
      coin,
      fromDerivationType,
      recoveryAddress,
      unspent_outputs
    } = payload
    try {
      yield put(A.recoverFundsLoading(coin))
      const password = yield call(promptForSecondPassword)
      const wallet = selectors.core.wallet.getWallet(yield select())
      const accounts = Wallet.selectHDAccounts(wallet)
      const account = HDAccountList.selectAccount(accountIndex, accounts)
      const fromDerivation = account.derivations.find((d) => d.type === fromDerivationType)
      const xprivT = Wallet.isDoubleEncrypted(wallet)
        ? crypto.decryptSecPass(
            Wallet.selectSharedKey(wallet),
            Wallet.selectIterations(wallet),
            password,
            fromDerivation.xpriv
          )
        : Task.of(fromDerivation.xpriv)

      const xpriv = yield call(() => taskToPromise(xprivT))

      if (coin === 'BCH') {
        const fee = yield call(api.getBchFees)
        const coins = unspent_outputs.map((val) => {
          const path = val.xpub
            ? val.xpub.path.split('M/')[1]
            : `1/${badChange?.indexOf(
                Bitcoin.address
                  .fromOutputScript(Buffer.from(val.script, 'hex'), Bitcoin.networks.bitcoin)
                  .toString()
              )}`

          const node = Bitcoin.bip32.fromBase58(xpriv).derivePath(path)
          const wif = Bitcoin.ECPair.fromWIF(node.toWIF())

          return Coin.fromJS({
            ...val,
            path,
            priv: wif
          })
        })

        const selection = selectAll(fee.priority, coins, fromCashAddr(recoveryAddress))
        const dust = yield call(api.getBchDust)
        const script = dust.output_script
        const coinDust = Coin.fromJS({ ...dust, script })
        const tx = bchSign(network, coinDust, selection)

        yield call(api.pushBchTx, tx.txHex, dust.lock_secret)
      } else if (coin === 'BTC') {
        const fee = yield call(api.getBtcFees)
        const coins = unspent_outputs.map((val) => {
          const path = val.xpub!.path.split('M/')[1]
          const node = Bitcoin.bip32.fromBase58(xpriv).derivePath(path)
          const wif = Bitcoin.ECPair.fromWIF(node.toWIF())

          return Coin.fromJS({
            ...val,
            path,
            priv: wif
          })
        })

        const selection = selectAll(fee.priority, coins, recoveryAddress)
        const tx = btcSign(network, selection)
        yield call(api.pushBtcTx, tx.txHex)
      } else {
        throw new Error(`No recovery method for ${coin}`)
      }

      yield put(A.recoverFundsSuccess(coin))
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Funds recovered to ${recoveryAddress}.`))
      yield put(actions.components.refresh.refreshClicked())
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.recoverFundsFailure(coin, error))
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displayWarning(error || `Recovery failed for ${coin}.`))
    }
  }

  const searchChainForFunds = function* (action: ReturnType<typeof A.searchChain>) {
    const { payload } = action
    const { accountIndex, coin } = payload
    try {
      yield put(A.searchChainLoading(coin))

      const wallet = selectors.core.wallet.getWallet(yield select())
      const accounts = Wallet.selectHDAccounts(wallet)
      const account = HDAccountList.selectAccount(accountIndex, accounts)

      // TODO, maybe add incident?
      // JUNE 2021 INCIDENT
      if (coin === 'BCH') {
        // Get the segwit and legacy derivations
        const badDerivation = account.derivations.find((d) => d.type === 'bech32')
        const goodDerivation = account.derivations.find((d) => d.type === 'legacy')
        // Get the top level account xpub
        const badXpub = badDerivation.xpub
        const goodXpub = goodDerivation.xpub
        // The wallet used the correct change_index to derive the wrong address
        // Get the most recent correct change_index
        const { addresses } = yield call(api.fetchBchData, [goodXpub])
        const { change_index } = addresses.find(({ address }) => address === goodXpub)

        // Get the next address to recover funds to
        const recoveryAddress = selectors.core.common.bch
          .getNextAvailableReceiveAddress(network, accountIndex, yield select())
          .getOrFail('No BCH address found to recovery to.')

        // Using the BECH32 (badXpub) derive change addresses down to 0
        // starting with the latest change_index from the legacy xpub according to multiaddr
        const badChange: string[] = []
        for (let i = 0; i <= change_index; i += 1) {
          const { publicKey } = Bitcoin.bip32.fromBase58(badXpub).derivePath(`1/${i}`)
          const { address: badAddress } = Bitcoin.payments.p2pkh({ pubkey: publicKey })
          if (badAddress) badChange.push(badAddress)
        }

        // Lookup unspents on BCH chain using BECH32 xpub
        const {
          unspent_outputs: receive_outputs
        }: UnspentResponseType = yield call(api.getBchUnspents, [badXpub])

        // Lookup unspents on BCH chain using badChange
        const {
          unspent_outputs: change_outputs
        }: UnspentResponseType = yield call(api.getBchUnspents, [badChange])

        // if no unspents from receive chain use change_outputs
        // if unspent from receive it will include change outputs
        const unspent_outputs = receive_outputs.length ? receive_outputs : change_outputs
        yield put(
          A.searchChainSuccess(
            accountIndex,
            coin,
            derivationType,
            unspent_outputs,
            toCashAddr(recoveryAddress, true),
            receive_outputs.length ? undefined : badChange
          )
        )
      } else if (coin === 'BTC') {
        // Get the bech32 account and xpub
        const derivation = account.derivations.find((d) => d.type === 'bech32')
        const { xpub } = derivation

        // Get the next address to recover funds to
        const recoveryAddress = selectors.core.common.btc
          .getNextAvailableReceiveAddress(network, accountIndex, 'bech32', yield select())
          .getOrFail('No BTC address found to recovery to.')

        // Lookup unspents on the `active` change instead of `activeBech32`
        const { unspent_outputs }: UnspentResponseType = yield call(
          api.getBtcUnspents,
          [xpub],
          -1,
          []
        )

        yield put(
          A.searchChainSuccess(accountIndex, coin, derivationType, unspent_outputs, recoveryAddress)
        )
      } else {
        yield put(
          A.searchChainFailure(
            accountIndex,
            coin,
            derivationType,
            `No recovery method for ${coin}.`
          )
        )
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.searchChainFailure(accountIndex, coin, derivationType, error))
    }
  }

  return {
    recoverFunds,
    searchChainForFunds
  }
}
