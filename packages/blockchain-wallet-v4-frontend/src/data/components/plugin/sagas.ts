import BIP39 from 'bip39-light'
import { ProductAuthOptions } from 'blockchain-wallet-v4-frontend/src/data/auth/types'
import { ethers } from 'ethers'
import { getSessionPayload } from 'plugin/internal/chromeStorage'
import { find, path, propEq } from 'ramda'
import { call, fork, put, select, take } from 'redux-saga/effects'

import { CountryScope } from '@core/types'
import { getPrivateKey } from '@core/utils/eth'
import { actions, actionTypes, selectors } from 'data'
import { fetchBalances } from 'data/balances/sagas'
import { actions as identityVerificationActions } from 'data/components/identityVerification/slice'
import goalSagas from 'data/goals/sagas'
import miscSagas from 'data/misc/sagas'
import profileSagas from 'data/modules/profile/sagas'
import { ExchangeAuthOriginType, LoginRoutinePayloadType } from 'data/types'
import walletSagas from 'data/wallet/sagas'
import * as C from 'services/alerts'
import { getFiatCurrencyFromCountry } from 'services/locales'
import { askSecondPasswordEnhancer } from 'services/sagas'

import { actions as signerActions } from './slice'

const logLocation = 'components/plugin/sagas'

export default ({ api, coreSagas, networks }) => {
  const {
    checkDataErrors,
    checkXpubCacheLegitimacy,
    updateMnemonicBackup,
    upgradeAddressLabelsSaga
  } = walletSagas({
    coreSagas
  })
  const { createExchangeUser, createUser } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const LOGIN_FORM = 'login'
  const { saveGoals } = goalSagas({ api, coreSagas, networks })
  const { startCoinWebsockets } = miscSagas()

  const getWallet = function* () {
    try {
      const wrapper = yield getSessionPayload()
      const mnemonic = BIP39.entropyToMnemonic(wrapper.wallet.hd_wallets._tail.array[0].seedHex)
      const privateKey = getPrivateKey(mnemonic)
      const wallet = new ethers.Wallet(privateKey, api.ethProvider)
      yield put(signerActions.setWallet(wallet))
      return wallet
    } catch (e) {
      throw new Error(`Failed to get wallet. ${e}`)
    }
  }

  const getPublicAddress = function* () {
    try {
      const signer: ethers.Wallet = yield call(getWallet)
      const address = yield signer.getAddress()
      yield put(signerActions.setPublicAddress(address))
    } catch (e) {
      throw new Error(`Failed to get address. ${e}`)
    }
  }

  const initTransactionRequestParameters = function* (action) {
    /* eslint-disable */
    let { chainId, from, to, data, gasLimit, value, nonce } = action.payload
    try {
      const wallet = yield call(getWallet)

      let payment = coreSagas.payment.eth.create({
        network: networks.eth
      })
      payment = yield payment.init({ coin: 'ETH', isErc20: false })

      if (!from) {
        from = yield wallet.getAddress()
      }

      if (!gasLimit) {
        gasLimit = path(['fees', 'gasLimit'], payment.value())
      }

      const feeData = yield wallet.getFeeData()
      const maxFeePerGas = feeData.maxFeePerGas._hex
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas._hex

      yield put(signerActions.setTransactionRequest({ from, to, gasLimit, data, value, nonce, maxPriorityFeePerGas, maxFeePerGas }))
    } catch (e) {
      throw new Error(`Failed to init transaction. ${e}`)
    }
  }

  const sendTransaction = function* (action) {
    try {
      const wallet: ethers.Wallet = yield call(getWallet)
      wallet.sendTransaction(action.payload)
    } catch (e) {
      throw new Error(`Failed to send transaction. ${e}`)
    }
  }

  const authNabu = function* () {
    yield put(
      actions.components.identityVerification.fetchSupportedCountries({ scope: CountryScope.KYC })
    )
    yield take([
      identityVerificationActions.setSupportedCountriesSuccess.type,
      identityVerificationActions.setSupportedCountriesFailure.type
    ])
    yield put(actions.modules.profile.signIn())
  }

  const checkWalletDerivationsLegitimacy = function* () {
    const accounts = yield call(coreSagas.wallet.getAccountsWithIncompleteDerivations)

    if (accounts.length > 0) {
      yield call(coreSagas.wallet.replenishDerivations, accounts)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const checkWalletDefaultAccountIdx = function* () {
    const needsUpdate = yield call(coreSagas.wallet.getHdWalletWithMissingDefaultAccountIdx)
    if (needsUpdate) {
      yield call(coreSagas.wallet.fixHdWalletWithMissingDefaultAccountIdx)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const checkWalletAccountsDefaultDerivation = function* () {
    const accounts = yield call(coreSagas.wallet.getAccountsWithMissingDefaultDerivation)
    if (accounts.length > 0) {
      yield call(coreSagas.wallet.fixAccountsWithMissingDefaultDerivation, accounts)
      yield put(actions.components.refresh.refreshClicked())
    }
  }

  const loginRoutineSaga = function* ({
    country = undefined,
    email = undefined,
    firstLogin = false,
    recovery = false,
    state = undefined
  }: LoginRoutinePayloadType) {
    try {
      const product = yield select(selectors.auth.getProduct)
      // If needed, the user should upgrade its wallet before being able to open the wallet
      const isHdWallet = yield select(selectors.core.wallet.isHdWallet)
      if (!isHdWallet) {
        yield put(actions.wallet.upgradeWallet(3))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const createExchangeUserFlag = (yield select(
        selectors.core.walletOptions.getCreateExchangeUserOnSignupOrLogin
      )).getOrElse(false)
      const isLatestVersion = yield select(selectors.core.wallet.isWrapperLatestVersion)
      yield call(coreSagas.settings.fetchSettings)
      if (!isLatestVersion) {
        yield put(actions.wallet.upgradeWallet(4))
        yield take(actionTypes.core.walletSync.SYNC_SUCCESS)
      }
      const isAccountReset: boolean = yield select(selectors.signup.getAccountReset)
      // Finish upgrades
      yield put(actions.auth.authenticate())
      yield put(actions.signup.setFirstLogin(firstLogin))
      // root and wallet are necessary to auth into the exchange
      yield call(coreSagas.kvStore.root.fetchRoot, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.unifiedCredentials.fetchMetadataUnifiedCredentials)
      yield call(coreSagas.kvStore.userCredentials.fetchMetadataUserCredentials)
      yield call(coreSagas.kvStore.walletCredentials.fetchMetadataWalletCredentials)
      // If there was no eth metadata kv store entry, we need to create one and that requires the second password.

      yield call(coreSagas.kvStore.eth.fetchMetadataEth, askSecondPasswordEnhancer)
      yield put(actions.middleware.webSocket.xlm.startStreams())
      yield call(coreSagas.kvStore.xlm.fetchMetadataXlm, askSecondPasswordEnhancer)
      yield call(coreSagas.kvStore.bch.fetchMetadataBch)
      yield call(coreSagas.data.xlm.fetchLedgerDetails)
      yield call(coreSagas.data.xlm.fetchData)

      yield call(authNabu)
      if (product === ProductAuthOptions.EXCHANGE && (recovery || !firstLogin)) {
        return yield put(
          actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Login)
        )
      }

      const guid = yield select(selectors.core.wallet.getGuid)
      if (firstLogin && !isAccountReset && !recovery) {
        // create nabu user
        yield call(createUser)
        yield call(api.setUserInitialAddress, country, state)
        yield call(coreSagas.settings.fetchSettings)
      }
      if (!isAccountReset && !recovery && createExchangeUserFlag) {
        if (firstLogin) {
          yield call(createExchangeUser, country)
          const exchangeAccountFailure = yield select(selectors.auth.getExchangeFailureStatus)

          if (exchangeAccountFailure) {
            // Clear cache of all previously stores exchange info
            // if exchange account creation fails so cache + login
            // doesn't get into a weird state
            yield put(actions.cache.removeExchangeLogin())
          } else {
            yield put(actions.cache.exchangeEmail(email))
            yield put(actions.cache.exchangeWalletGuid(guid))
            yield put(actions.cache.setUnifiedAccount(true))
          }
        } else {
          // We likely don't need this, don't remember why it was added
          // Leaving in case bugs arise - LB
          // yield take([
          //   actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS,
          //   actionTypes.core.kvStore.unifiedCredentials.FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE
          // ])
          const existingUserCountryCode = (yield select(
            selectors.modules.profile.getUserCountryCode
          )).getOrElse('US')
          yield fork(createExchangeUser, existingUserCountryCode)
        }
      }
      if (firstLogin) {
        const countryCode = country || 'US'
        const currency = getFiatCurrencyFromCountry(countryCode)

        yield put(actions.modules.settings.updateCurrency(currency, true))
        yield put(actions.core.settings.setCurrency(currency))

        if (isAccountReset) {
          if (product === ProductAuthOptions.EXCHANGE) {
            yield put(
              actions.modules.profile.authAndRouteToExchangeAction(ExchangeAuthOriginType.Login)
            )
            return
          }
          if (product === ProductAuthOptions.WALLET) {
            yield put(actions.router.push('/plugin/coinslist'))
          } else {
            yield put(actions.router.push('/select-product'))
          }
        } else {
          yield put(actions.router.push('/verify-email-step'))
        }
      } else {
        yield put(actions.router.push('/plugin/coinslist'))
      }
      yield call(fetchBalances)
      yield call(saveGoals, firstLogin)
      yield put(actions.goals.runGoals())
      yield call(upgradeAddressLabelsSaga)
      yield put(actions.auth.startLogoutTimer())
      yield call(startCoinWebsockets)

      // store guid and email in cache for future login
      yield put(actions.cache.guidEntered(guid))
      if (email) {
        yield put(actions.cache.emailStored(email))
      }
      // reset auth type and clear previous login form state
      yield put(actions.auth.setAuthType(0))
      yield put(actions.form.destroy(LOGIN_FORM))
      // set payload language to settings language
      const language = yield select(selectors.preferences.getLanguage)
      yield put(actions.modules.settings.updateLanguage(language))
      // simple buy tasks
      // only run the fetch simplebuy if there's no simplebuygoal
      const goals = selectors.goals.getGoals(yield select())
      const buySellGoal = find(propEq('name', 'buySell'), goals)
      if (!buySellGoal) {
        yield put(actions.components.buySell.fetchPaymentMethods())
      }
      // swap tasks
      yield put(actions.components.swap.fetchTrades())
      // check/update btc account names
      yield call(coreSagas.wallet.checkAndUpdateWalletNames)
      // We are checking wallet metadata to see if mnemonic is verified
      // and then syncing that information with new Wallet Account model
      // being used for SSO
      yield fork(updateMnemonicBackup)
      // ensure xpub cache is correct
      yield fork(checkXpubCacheLegitimacy)
      // ensure derivations are correct
      yield fork(checkWalletDerivationsLegitimacy)
      // ensure default_account_idx is set
      yield fork(checkWalletDefaultAccountIdx)
      // ensure default_derivation is set on each account
      yield fork(checkWalletAccountsDefaultDerivation)
      yield fork(checkDataErrors)
      yield put(actions.auth.loginSuccess(true))

      // Debit Card Module initialization
      yield put(actions.components.debitCard.getProducts())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loginRoutineSaga', e))
      // Redirect to error page instead of notification
      yield put(actions.alerts.displayError(C.WALLET_LOADING_ERROR))
    }
  }

  const autoLogin = function* () {
    try {
      yield put(actions.ws.startSocket())
      yield call(loginRoutineSaga, {})
    } catch (error) {
      yield put(actions.logs.logErrorMessage(logLocation, 'autoLogin', error))
    }
  }

  return {
    autoLogin,
    getPublicAddress,
    getWallet,
    initTransactionRequestParameters,
    loginRoutineSaga,
    sendTransaction
  }
}
