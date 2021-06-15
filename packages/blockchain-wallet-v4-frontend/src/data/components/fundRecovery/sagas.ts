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
        debugger
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
    const { accountIndex, coin, derivationType } = payload
    try {
      yield put(A.searchChainLoading(accountIndex, coin, derivationType))

      const wallet = selectors.core.wallet.getWallet(yield select())
      const accounts = Wallet.selectHDAccounts(wallet)
      const account = HDAccountList.selectAccount(accountIndex, accounts)

      // TODO, maybe add incident?
      if (coin === 'BCH') {
        // FOR CHANGE
        // 1. get the change_index from the good xpub on bch chain
        // 2. derive change addresses from '1/change_index...0' from SEGWIT xpub
        // 3. get unspents from the change addresses
        // FOR WRONG RECEIVE
        // 1. get the SEGWIT derivation
        // 2. get unspents from SEGWIT xpub
        // Note: wrong receive was always index 0 because of a separate bug
        // which caused wallet to look up receive_index from the wrong xpub
        // or, elsing things to eventually return receive_index as 0.
        const badDerivation = account.derivations.find((d) => d.type === derivationType)
        const goodDerivation = account.derivations.find((d) => d.type === 'legacy')
        const badXpub = badDerivation.xpub
        const goodXpub = goodDerivation.xpub
        const { addresses } = yield call(api.fetchBchData, [goodXpub])
        const { change_index } = addresses.find(({ address }) => address === goodXpub)

        const recoveryAddress = selectors.core.common.bch
          .getNextAvailableReceiveAddress(network, accountIndex, yield select())
          .getOrFail('No BCH address found to recovery to.')

        const badChange: string[] = []
        for (let i = 0; i <= change_index; i += 1) {
          const { publicKey } = Bitcoin.bip32.fromBase58(badXpub).derivePath(`1/${i}`)
          const { address: badAddress } = Bitcoin.payments.p2pkh({ pubkey: publicKey })
          if (badAddress) badChange.push(badAddress)
        }

        const {
          unspent_outputs: receive_outputs
        }: UnspentResponseType = yield call(api.getBchUnspents, [badXpub])

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
        // FOR WRONG RECEIVE
        // 1. get the SEGWIT derivation
        // 2. get unspents from SEGWIT xpub on active param (not activeBech32)
        const derivation = account.derivations.find((d) => d.type === derivationType)
        const { xpub } = derivation
        const recoveryAddress = selectors.core.common.btc
          .getNextAvailableReceiveAddress(network, accountIndex, 'bech32', yield select())
          .getOrFail('No BTC address found to recovery to.')

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
