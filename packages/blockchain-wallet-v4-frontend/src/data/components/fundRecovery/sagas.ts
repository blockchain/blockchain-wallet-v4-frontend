import * as Bitcoin from 'bitcoinjs-lib'
// eslint-disable-next-line
import Task from 'data.task'
import { set } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { crypto } from 'blockchain-wallet-v4/src'
import { selectAll } from 'blockchain-wallet-v4/src/coinSelection'
import * as Coin from 'blockchain-wallet-v4/src/coinSelection/coin'
import { displayCoinToCoin } from 'blockchain-wallet-v4/src/exchange'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { UnspentResponseType } from 'blockchain-wallet-v4/src/network/api/btc/types'
import { signSelection as bchSign } from 'blockchain-wallet-v4/src/signer/bch'
import { signSelection as btcSign } from 'blockchain-wallet-v4/src/signer/btc'
import { HDAccountList, Wallet } from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { toCashAddr } from 'blockchain-wallet-v4/src/utils/bch'
import { actions, selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

import * as A from './actions'
import * as S from './selectors'

export default ({ api }: { api: APIType }) => {
  // const logLocation = 'components/fundRecovery/sagas'
  const network = Bitcoin.networks.bitcoin
  const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

  const recoverFunds = function* (action: ReturnType<typeof A.recoverFunds>) {
    const { payload } = action
    const { coin } = payload
    const searchChainStatusR = S.getSearchChainStatus(yield select(), coin)
    const searchChainStatus = searchChainStatusR.getOrFail('Not available.')

    const { derivation, selection } = searchChainStatus

    try {
      yield put(A.recoverFundsLoading(coin))
      const password = yield call(promptForSecondPassword)
      const wallet = selectors.core.wallet.getWallet(yield select())
      const xprivT = Wallet.isDoubleEncrypted(wallet)
        ? crypto.decryptSecPass(
            Wallet.selectSharedKey(wallet),
            Wallet.selectIterations(wallet),
            password,
            derivation.xpriv
          )
        : Task.of(derivation.xpriv)

      const xpriv = yield call(() => taskToPromise(xprivT))
      const inputs = selection.inputs.map((val) => {
        const node = Bitcoin.bip32.fromBase58(xpriv).derivePath(val.path)
        const wif = Bitcoin.ECPair.fromWIF(node.toWIF())

        return set(Coin.priv, wif, val)
      })

      const selectionWithKeys = { ...selection, inputs }
      let recoveryAddress = selection.outputs[0].address

      if (coin === 'BCH') {
        recoveryAddress = toCashAddr(recoveryAddress)

        const dust = yield call(api.getBchDust)
        const script = dust.output_script
        const coinDust = Coin.fromJS({ ...dust, script })
        const tx = bchSign(network, coinDust, selectionWithKeys)

        yield call(api.pushBchTx, tx.txHex, dust.lock_secret)
      } else if (coin === 'BTC') {
        const tx = btcSign(network, selectionWithKeys)

        yield call(api.pushBtcTx, tx.txHex)
      } else {
        throw new Error(`No recovery method for ${coin}`)
      }

      yield put(A.recoverFundsSuccess(coin))
      yield put(actions.modals.closeAllModals())
      yield put(
        actions.alerts.displaySuccess(
          `${displayCoinToCoin({
            coin,
            value: selection.outputs[0].value
          })} successfully recovered to ${recoveryAddress}.`
        )
      )
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

        // Map unspents to coins
        const coins = unspent_outputs.map((val) => {
          const path = val.xpub
            ? val.xpub.path.split('M/')[1]
            : `1/${badChange?.indexOf(
                Bitcoin.address
                  .fromOutputScript(Buffer.from(val.script, 'hex'), Bitcoin.networks.bitcoin)
                  .toString()
              )}`

          return Coin.fromJS({
            ...val,
            path
          })
        })
        const fee = yield call(api.getBchFees)
        const selection = selectAll(fee.priority, coins, recoveryAddress)

        yield put(A.searchChainSuccess(coin, badDerivation, selection))
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

        // Map unspents to coins
        const coins = unspent_outputs.map((val) => {
          const path = val.xpub!.path.split('M/')[1]
          return Coin.fromJS({
            ...val,
            path
          })
        })
        const fee = yield call(api.getBtcFees)
        const selection = selectAll(fee.regular, coins, recoveryAddress)

        yield put(A.searchChainSuccess(coin, derivation, selection))
      } else {
        yield put(A.searchChainFailure(coin, `No recovery method for ${coin}.`))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.searchChainFailure(coin, error))
    }
  }

  return {
    recoverFunds,
    searchChainForFunds
  }
}
