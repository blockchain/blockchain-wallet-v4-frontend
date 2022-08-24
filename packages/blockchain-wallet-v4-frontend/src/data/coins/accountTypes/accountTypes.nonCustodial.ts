import BigNumber from 'bignumber.js'
import { add, head, lift, nth, path, prop, propEq } from 'ramda'
import { select } from 'redux-saga/effects'

import { coreSelectors, Remote, utils } from '@core'
import { APIType } from '@core/network/api'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { BSBalanceType, CoinType, ExtractSuccess, PaymentValue } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { convertStandardToBase } from 'data/components/exchange/services'
import { SwapAccountType } from 'data/types'

import { CoinAccountSelectorType } from '../types'
import { generateInterestAccount, generateTradingAccount } from '../utils'
import { NonCustodialAccountTypeClass } from './accountTypes.classes'

const { formatAddr, isCashAddr, toCashAddr } = utils.bch

export class NonCustodialAccountType implements NonCustodialAccountTypeClass {
  api: APIType

  networks: any

  constructor(api: APIType, networks: any) {
    this.api = api
    this.networks = networks
  }

  *getNextReceiveAddress(coin: string, index?: number) {
    let address = ''

    switch (coin) {
      case 'BCH': {
        const state = yield select()
        const defaultAccountIndex =
          index || (yield select(selectors.core.kvStore.bch.getDefaultAccountIndex)).getOrFail()
        const nextAddress = selectors.core.common.bch
          .getNextAvailableReceiveAddress(this.networks.bch, defaultAccountIndex, state)
          .getOrFail('Failed to get BCH receive address')

        address = isCashAddr(nextAddress) ? formatAddr(nextAddress) : toCashAddr(nextAddress)
        break
      }
      case 'BTC': {
        const state = yield select()
        const defaultAccountIndex =
          index || (yield select(selectors.core.wallet.getDefaultAccountIndex))
        const defaultDerivation = selectors.core.common.btc.getAccountDefaultDerivation(
          defaultAccountIndex,
          state
        )
        address = selectors.core.common.btc
          .getNextAvailableReceiveAddress(
            this.networks.btc,
            defaultAccountIndex,
            defaultDerivation,
            state
          )
          .getOrFail('Failed to get BTC receive address')
        break
      }
      case 'ETH':
        address = selectors.core.kvStore.eth
          .getDefaultAddress(yield select())
          .getOrFail(`Failed to get ETH receive address`)
        break
      case 'XLM':
        address = selectors.core.kvStore.xlm
          .getDefaultAccountId(yield select())
          .getOrFail(`Failed to get XLM receive address`)
        break
      default:
    }

    return { address }
  }

  *getDefaultAccount(coin: string) {
    switch (coin) {
      case 'BCH':
        const bchAccountsR = yield select(selectors.core.common.bch.getAccountsBalances)
        const bchDefaultIndex = (yield select(
          selectors.core.kvStore.bch.getDefaultAccountIndex
        )).getOrElse(0)
        return bchAccountsR.map(nth(bchDefaultIndex))
      case 'BTC':
        const btcAccountsR = yield select(selectors.core.common.btc.getAccountsBalances)
        const btcDefaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
        return btcAccountsR.map(nth(btcDefaultIndex))
      case 'ETH':
        const ethAccountR = yield select(selectors.core.common.eth.getAccountBalances)
        return ethAccountR.map(head)
      case 'XLM':
        return (yield select(selectors.core.common.xlm.getAccountBalances)).map(head)
      default:
    }
  }

  *getOrUpdateProvisionalPayment(coreSagas, paymentR, coin: string) {
    return yield coreSagas.payment[coin.toLowerCase()].create({
      network: this.networks[coin.toLowerCase()],
      payment: paymentR.getOrElse(<PaymentValue>{})
    })
  }

  getAccounts = (state, ownProps) => {
    switch (ownProps.coin) {
      case 'BCH': {
        return createDeepEqualSelector(
          [
            coreSelectors.wallet.getHDAccounts, // non-custodial accounts
            coreSelectors.data.bch.getAddresses, // non-custodial xpub info
            coreSelectors.kvStore.bch.getAccounts, // non-custodial metadata info
            coreSelectors.common.bch.getActiveAddresses, // imported addresses
            (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
            (state, ownProps) => ownProps // selector config
          ],
          (bchAccounts, bchDataR, bchMetadataR, importedAddressesR, sbBalanceR, ownProps) => {
            const transform = (
              bchData,
              bchMetadata,
              importedAddresses,
              sbBalance: ExtractSuccess<typeof sbBalanceR>
            ) => {
              const { coin } = ownProps
              let accounts: SwapAccountType[] = []
              // add non-custodial accounts if requested
              if (ownProps?.nonCustodialAccounts) {
                accounts = accounts.concat(
                  bchAccounts
                    .map((acc) => {
                      const index = prop('index', acc)
                      // this is using hdAccount with new segwit structure
                      // need to get legacy xPub from derivations object similar to btc selector
                      const xpub = prop(
                        'xpub',
                        prop('derivations', acc).find((derr) => derr.type === 'legacy')
                      )
                      const data = prop(xpub, bchData)
                      const metadata = bchMetadata[index]
                      return {
                        accountIndex: prop('index', acc),
                        address: index,
                        archived: prop('archived', metadata) || false,
                        balance: prop('final_balance', data),
                        baseCoin: coin,
                        coin,
                        label: prop('label', metadata) || xpub,
                        type: ADDRESS_TYPES.ACCOUNT
                      }
                    })
                    .filter(propEq('archived', false))
                )
              }

              // add imported addresses if requested
              if (ownProps?.importedAddresses) {
                accounts = accounts.concat(
                  importedAddresses.map((importedAcc) => ({
                    address: importedAcc.addr,
                    balance: importedAcc.info.final_balance,
                    baseCoin: coin,
                    coin,
                    label: importedAcc.label || importedAcc.addr,
                    type: ADDRESS_TYPES.LEGACY
                  }))
                )
              }

              // add trading accounts if requested
              if (ownProps?.tradingAccounts) {
                accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
              }

              return accounts
            }

            return lift(transform)(bchDataR, bchMetadataR, importedAddressesR, sbBalanceR)
          }
        )(state, ownProps)
      }
      case 'BTC': {
        return createDeepEqualSelector(
          [
            coreSelectors.wallet.getHDAccounts, // non-custodial accounts
            coreSelectors.data.btc.getAddresses, // non-custodial xpub info
            coreSelectors.common.btc.getActiveAddresses, // imported addresses
            (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
            (state, { coin }) => selectors.balances.getCoinInterestBalance(coin, state), // custodial accounts
            (state, ownProps): CoinAccountSelectorType & { coin: CoinType } => ownProps // selector config
          ],
          (btcAccounts, btcDataR, importedAddressesR, sbBalanceR, interestBalanceR, ownProps) => {
            const transform = (
              btcData,
              importedAddresses,
              sbBalance: ExtractSuccess<typeof sbBalanceR>,
              interestBalance: ExtractSuccess<typeof interestBalanceR>
            ) => {
              const { coin } = ownProps
              let accounts: SwapAccountType[] = []
              // add non-custodial accounts if requested
              if (ownProps?.nonCustodialAccounts) {
                // each account has a derivations object with legacy xpub and segwit xpub
                // need to extract each xpub for balance
                const xpubArray = (acc) =>
                  prop('derivations', acc).map((derr) => prop('xpub', derr))
                const xpubBalance = (acc) =>
                  xpubArray(acc).map((xpub) =>
                    prop<string, any>('final_balance', prop(xpub, btcData))
                  )
                accounts = accounts.concat(
                  btcAccounts
                    .map((acc) => ({
                      accountIndex: prop('index', acc),
                      address: prop('index', acc),
                      archived: prop('archived', acc) || false,
                      balance: xpubBalance(acc).reduce(add, 0),
                      baseCoin: coin,
                      coin,
                      label: prop('label', acc) || prop('xpub', acc),
                      type: ADDRESS_TYPES.ACCOUNT
                    }))
                    .filter(propEq('archived', false))
                )
              }

              // add imported addresses if requested
              if (ownProps?.importedAddresses) {
                accounts = accounts.concat(
                  importedAddresses.map((importedAcc) => ({
                    address: importedAcc.addr,
                    balance: importedAcc.info.final_balance,
                    baseCoin: coin,
                    coin,
                    label: importedAcc.label || importedAcc.addr,
                    type: ADDRESS_TYPES.LEGACY
                  }))
                )
              }

              // add trading accounts if requested
              if (ownProps?.tradingAccounts) {
                accounts = accounts.concat(generateTradingAccount(coin, sbBalance))
              }

              // add interest accounts if requested
              if (ownProps?.interestAccounts) {
                accounts = accounts.concat(generateInterestAccount(coin, interestBalance))
              }
              return accounts
            }

            return lift(transform)(btcDataR, importedAddressesR, sbBalanceR, interestBalanceR)
          }
        )(state, ownProps)
      }
      case 'ETH': {
        return createDeepEqualSelector(
          [
            coreSelectors.data.eth.getAddresses, // non-custodial accounts
            coreSelectors.kvStore.eth.getAccounts, // non-custodial metadata
            (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
            (state, ownProps) => ownProps // selector config
          ],
          (ethDataR, ethMetadataR, sbBalanceR, ownProps) => {
            const transform = (
              ethData,
              ethMetadata,
              sbBalance: ExtractSuccess<typeof sbBalanceR>
            ) => {
              const { coin } = ownProps
              let accounts: SwapAccountType[] = []

              // add non-custodial accounts if requested
              if (ownProps?.nonCustodialAccounts) {
                accounts = accounts.concat(
                  ethMetadata.map((acc) => {
                    const address = prop('addr', acc)
                    const data = prop(address, ethData)

                    return {
                      address,
                      balance: prop('balance', data),
                      baseCoin: coin,
                      coin,
                      label: prop('label', acc) || address,
                      type: ADDRESS_TYPES.ACCOUNT
                    }
                  })
                )
              }

              // add trading accounts if requested
              if (ownProps?.tradingAccounts) {
                accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
              }

              return accounts
            }

            return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
          }
        )(state, ownProps)
      }
      case 'XLM': {
        return createDeepEqualSelector(
          [
            coreSelectors.kvStore.xlm.getAccounts, // non-custodial metadata
            (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
            (state, ownProps) => ownProps // selector config
          ],
          (xlmMetadataR, sbBalanceR, ownProps) => {
            const transform = (xlmMetadata, sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
              const { coin } = ownProps
              let accounts: SwapAccountType[] = []

              // add non-custodial accounts if requested
              if (ownProps?.nonCustodialAccounts) {
                accounts = accounts.concat(
                  xlmMetadata
                    .map((acc) => {
                      const address = prop('publicKey', acc)
                      const balance = coreSelectors.data.coins
                        .getCoinUnifiedBalance('XLM')(state)
                        .getOrElse(new BigNumber(0))
                      return {
                        address,
                        archived: prop('archived', acc) || false,
                        balance,
                        baseCoin: coin,
                        coin,
                        label: prop('label', acc) || address,
                        type: ADDRESS_TYPES.ACCOUNT
                      }
                    })
                    .filter(propEq('archived', false))
                )
              }

              // add trading accounts if requested
              if (ownProps?.tradingAccounts) {
                accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
              }

              return accounts
            }

            return lift(transform)(xlmMetadataR, sbBalanceR)
          }
        )(state, ownProps)
      }
      default:
        return Remote.Failure('')
    }
  }
}
