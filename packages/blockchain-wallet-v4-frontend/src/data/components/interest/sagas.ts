import BigNumber from 'bignumber.js'
import { getUnixTime } from 'date-fns'
import { concat, isEmpty, isNil, last, prop } from 'ramda'
import { FormAction, initialize } from 'redux-form'
import { all, call, delay, put, select, take } from 'redux-saga/effects'

import { Exchange, Remote } from '@core'
import { APIType } from '@core/network/api'
import {
  AccountTypes,
  BSBalancesType,
  CoinType,
  EarnAccountBalanceType,
  EarnAccountType,
  EarnAfterTransactionType,
  EarnBondingDepositsResponseType,
  EarnBondingDepositsType,
  EarnTransactionResponseType,
  EarnUnbondingWithdrawalsType,
  NabuCustodialProductType,
  PaymentValue,
  Product,
  RatesType,
  RemoteDataType,
  TransactionType
} from '@core/types'
import { errorHandler, errorHandlerCode } from '@core/utils'
import { actions, selectors } from 'data'
import coinSagas from 'data/coins/sagas'
import { generateProvisionalPaymentAmount } from 'data/coins/utils'
import profileSagas from 'data/modules/profile/sagas'
import { CustodialSanctionsErrorCodeEnum, ModalName } from 'data/types'

import { convertStandardToBase } from '../exchange/services'
import utils from './sagas.utils'
import * as S from './selectors'
import { actions as A } from './slice'
import {
  EarnInstrumentsType,
  EarnProductsType,
  EarnTabsType,
  EarnTransactionType,
  PendingTransactionType,
  RewardsDepositFormType,
  StakingDepositFormType,
  StakingWithdrawalFormType
} from './types'

const PASSIVE_REWARDS_DEPOSIT_FORM = 'passiveRewardsDepositForm'
const STAKING_DEPOSIT_FORM = 'stakingDepositForm'
const ACTIVE_REWARDS_DEPOSIT_FORM = 'activeRewardsDepositForm'
const ACTIVE_REWARDS_API_PRODUCT = 'EARN_CC1W'
const STAKING_API_PRODUCT = 'STAKING'
export const logLocation = 'components/interest/sagas'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { isTier2, waitForUserData } = profileSagas({ api, coreSagas, networks })
  const { buildAndPublishPayment, createLimits, createPayment, getCustodialAccountForCoin } = utils(
    {
      coreSagas,
      networks
    }
  )

  const {
    getDefaultAccountForCoin,
    getNextReceiveAddressForCoin,
    getOrUpdateProvisionalPaymentForCoin
  } = coinSagas({
    api,
    coreSagas,
    networks
  })

  const getAccountIndexOrAccount = (coin: CoinType, account: AccountTypes) => {
    if (coin === 'BTC' || coin === 'BCH') {
      return account.index
    }
    return account.address
  }

  const fetchRewardsBalance = function* () {
    try {
      yield put(A.fetchRewardsBalanceLoading())
      if (!(yield call(isTier2))) return yield put(A.fetchRewardsBalanceSuccess({}))
      const response: ReturnType<typeof api.getEarnAccountBalance> = yield call(
        api.getEarnAccountBalance,
        { product: 'savings' } as EarnAccountBalanceType
      )
      yield put(A.fetchRewardsBalanceSuccess(response || {}))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchRewardsBalanceFailure(error))
    }
  }

  const fetchStakingBalance = function* () {
    try {
      yield put(A.fetchStakingBalanceLoading())
      if (!(yield call(isTier2))) return yield put(A.fetchStakingBalanceSuccess({}))
      const response: ReturnType<typeof api.getEarnAccountBalance> = yield call(
        api.getEarnAccountBalance,
        { product: 'staking' } as EarnAccountBalanceType
      )
      yield put(A.fetchStakingBalanceSuccess(response || {}))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchStakingBalanceFailure(error))
    }
  }

  const fetchActiveRewardsBalance = function* () {
    try {
      yield put(A.fetchActiveRewardsBalanceLoading())
      if (!(yield call(isTier2))) return yield put(A.fetchActiveRewardsBalanceSuccess({}))
      const response: ReturnType<typeof api.getEarnAccountBalance> = yield call(
        api.getEarnAccountBalance,
        { product: ACTIVE_REWARDS_API_PRODUCT } as EarnAccountBalanceType
      )
      yield put(A.fetchActiveRewardsBalanceSuccess(response || {}))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchActiveRewardsBalanceFailure(error))
    }
  }

  const fetchInterestEligible = function* () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchInterestEligibleLoading())
      const response: ReturnType<typeof api.getInterestEligible> = yield call(
        api.getInterestEligible
      )
      yield put(A.fetchInterestEligibleSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestEligibleFailure(error))
    }
  }

  const fetchStakingEligible = function* () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchStakingEligibleLoading())
      const response: ReturnType<typeof api.getEarnEligible> = yield call(
        api.getEarnEligible,
        'staking'
      )
      yield put(A.fetchStakingEligibleSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchStakingEligibleFailure(error))
    }
  }

  const fetchActiveRewardsEligible = function* () {
    try {
      yield call(waitForUserData)
      yield put(A.fetchActiveRewardsEligibleLoading())
      const response: ReturnType<typeof api.getEarnEligible> = yield call(
        api.getEarnEligible,
        ACTIVE_REWARDS_API_PRODUCT
      )
      yield put(A.fetchActiveRewardsEligibleSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchActiveRewardsEligibleFailure(error))
    }
  }

  const fetchEarnInstruments = function* () {
    try {
      yield put(A.fetchEarnInstrumentsLoading())

      const [stakingRates, activeRewardsRates, passiveRewardsRates] = yield all([
        call(api.getEarnRates, 'staking'),
        call(api.getEarnRates, ACTIVE_REWARDS_API_PRODUCT),
        call(api.getRewardsRates)
      ])

      yield put(A.fetchStakingRatesSuccess(stakingRates))
      yield put(A.fetchInterestRatesSuccess(passiveRewardsRates))
      yield put(A.fetchActiveRewardsRatesSuccess(activeRewardsRates))
      const allRatesR = yield select(S.getAllRates)
      const walletCurrencyR = yield select(S.getWalletCurrency)
      const allRates = allRatesR.getOrElse({})
      const walletCurrency = walletCurrencyR.getOrElse('USD')

      const stakingCoins: Array<string> = Object.keys(stakingRates.rates)
      const rewardsCoins: Array<string> = Object.keys(passiveRewardsRates.rates)
      const activeRewardsCoins: Array<string> = Object.keys(activeRewardsRates.rates)

      const stakingInstruments: EarnInstrumentsType = stakingCoins.map((coin) => ({
        coin,
        product: 'Staking',
        rate: allRates[`${coin}-${walletCurrency}`]
      }))
      const passiveRewardsRatesInstruments: EarnInstrumentsType = rewardsCoins.map((coin) => ({
        coin,
        product: 'Passive',
        rate: allRates[`${coin}-${walletCurrency}`]
      }))
      const activeRewardsRatesInstruments: EarnInstrumentsType = activeRewardsCoins.map((coin) => ({
        coin,
        product: 'Active',
        rate: allRates[`${coin}-${walletCurrency}`]
      }))

      yield put(
        A.fetchEarnInstrumentsSuccess({
          earnInstruments: activeRewardsRatesInstruments
            .concat(stakingInstruments)
            .concat(passiveRewardsRatesInstruments)
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEarnInstrumentsFailure(error))
    }
  }

  const fetchInterestLimits = function* ({ payload }: ReturnType<typeof A.fetchInterestLimits>) {
    const { coin, currency } = payload
    try {
      yield put(A.fetchInterestLimitsLoading())
      const response: ReturnType<typeof api.getInterestLimits> = yield call(
        api.getInterestLimits,
        coin,
        currency
      )
      yield put(A.fetchInterestLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestLimitsFailure(error))
    }
  }

  const fetchStakingLimits = function* () {
    try {
      yield put(A.fetchStakingLimitsLoading())
      const response: ReturnType<typeof api.getEarnLimits> = yield call(
        api.getEarnLimits,
        'staking'
      )
      yield put(A.fetchStakingLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchStakingLimitsFailure(error))
    }
  }

  const fetchStakingWithdrawals = function* () {
    try {
      yield put(A.fetchStakingWithdrawalsLoading())
      const response: ReturnType<typeof api.getEarnWithdrawalRequests> = yield call(
        api.getEarnWithdrawalRequests,
        'staking'
      )
      yield put(A.fetchStakingWithdrawalsSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchStakingWithdrawalsFailure(error))
    }
  }

  const fetchActiveRewardsLimits = function* () {
    try {
      yield put(A.fetchActiveRewardsLimitsLoading())
      const response: ReturnType<typeof api.getEarnLimits> = yield call(
        api.getEarnLimits,
        ACTIVE_REWARDS_API_PRODUCT
      )
      yield put(A.fetchActiveRewardsLimitsSuccess(response.limits))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchActiveRewardsLimitsFailure(error))
    }
  }

  const fetchRewardsAccount = function* ({ payload }: ReturnType<typeof A.fetchRewardsAccount>) {
    const { coin } = payload
    try {
      yield put(A.fetchRewardsAccountLoading())
      const paymentAccount: ReturnType<typeof api.getEarnAccount> = yield call(api.getEarnAccount, {
        coin,
        product: 'savings'
      } as EarnAccountType)
      yield put(A.fetchRewardsAccountSuccess({ ...paymentAccount }))
      yield put(A.setUnderSanctions({ message: null }))
    } catch (e) {
      const error = errorHandler(e)
      const errorCode: number | string = errorHandlerCode(e)
      if (errorCode === CustodialSanctionsErrorCodeEnum.EU_5_SANCTION_ERROR) {
        yield put(A.setUnderSanctions({ message: e?.ux?.message }))
      }
      yield put(A.fetchRewardsAccountFailure(error))
    }
  }

  const fetchStakingAccount = function* ({ payload }: ReturnType<typeof A.fetchStakingAccount>) {
    const { coin } = payload
    try {
      yield put(A.fetchStakingAccountLoading())
      const paymentAccount: ReturnType<typeof api.getEarnAccount> = yield call(api.getEarnAccount, {
        coin,
        product: 'staking'
      } as EarnAccountType)
      yield put(A.fetchStakingAccountSuccess({ ...paymentAccount }))
      yield put(A.setUnderSanctions({ message: null }))
    } catch (e) {
      const error = errorHandler(e)
      const errorCode: number | string = errorHandlerCode(e)
      if (errorCode === CustodialSanctionsErrorCodeEnum.EU_5_SANCTION_ERROR) {
        yield put(A.setUnderSanctions({ message: e?.ux?.message }))
      }
      yield put(A.fetchStakingAccountFailure(error))
    }
  }

  const fetchActiveRewardsAccount = function* ({
    payload
  }: ReturnType<typeof A.fetchActiveRewardsAccount>) {
    const { coin } = payload
    try {
      yield put(A.fetchActiveRewardsAccountLoading())
      const paymentAccount: ReturnType<typeof api.getEarnAccount> = yield call(api.getEarnAccount, {
        coin,
        product: ACTIVE_REWARDS_API_PRODUCT
      } as EarnAccountType)
      yield put(A.fetchActiveRewardsAccountSuccess({ ...paymentAccount }))
      yield put(A.setUnderSanctions({ message: null }))
    } catch (e) {
      const error = errorHandler(e)
      const errorCode: number | string = errorHandlerCode(e)
      if (errorCode === CustodialSanctionsErrorCodeEnum.EU_5_SANCTION_ERROR) {
        yield put(A.setUnderSanctions({ message: e?.ux?.message }))
      }
      yield put(A.fetchActiveRewardsAccountFailure(error))
    }
  }

  const fetchInterestRates = function* () {
    try {
      yield put(A.fetchInterestRatesLoading())
      const response: ReturnType<typeof api.getRewardsRates> = yield call(api.getRewardsRates)
      yield put(A.fetchInterestRatesSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchInterestRatesFailure(error))
    }
  }
  const fetchStakingRates = function* () {
    try {
      yield put(A.fetchStakingRatesLoading())
      const response: ReturnType<typeof api.getEarnRates> = yield call(api.getEarnRates, 'staking')
      yield put(A.fetchStakingRatesSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchStakingRatesFailure(error))
    }
  }
  const fetchActiveRewardsRates = function* () {
    try {
      yield put(A.fetchActiveRewardsRatesLoading())
      const response: ReturnType<typeof api.getEarnRates> = yield call(
        api.getEarnRates,
        ACTIVE_REWARDS_API_PRODUCT
      )
      yield put(A.fetchActiveRewardsRatesSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchActiveRewardsRatesFailure(error))
    }
  }

  const fetchEarnTransactions = function* ({
    payload
  }: ReturnType<typeof A.fetchEarnTransactions>) {
    const { coin, reset } = payload

    try {
      const isStakingEnabled = selectors.core.walletOptions
        .getIsStakingEnabled(yield select())
        .getOrElse(false) as boolean
      const isActiveRewardsEnabled = selectors.core.walletOptions
        .getActiveRewardsEnabled(yield select())
        .getOrElse(false) as boolean
      const rewardsNextPageUrl = !reset ? yield select(S.getRewardsTransactionsNextPage) : undefined
      const stakingNextPageUrl = !reset ? yield select(S.getStakingTransactionsNextPage) : undefined
      const activeRewardsNextPageUrl = !reset
        ? yield select(S.getActiveRewardsTransactionsNextPage)
        : undefined
      const earnTab: EarnTabsType = yield select(S.getEarnTab)
      // check if invoked from continuous scroll
      if (!reset) {
        const txList = yield select(S.getEarnTransactions)
        // return if next page is already being fetched or there is no next page
        if (
          Remote.Loading.is(last(txList)) ||
          (!rewardsNextPageUrl && !stakingNextPageUrl && !activeRewardsNextPageUrl)
        )
          return
      }
      yield put(A.fetchEarnTransactionsLoading({ reset }))
      let rewardsResponse: EarnTransactionResponseType = { items: [], next: null }
      let stakingResponse: EarnTransactionResponseType = { items: [], next: null }
      let activeRewardsResponse: EarnTransactionResponseType = { items: [], next: null }

      // if rewards nextpage is not empty and the filter tab selected either All or Passive in earn/history
      if (rewardsNextPageUrl !== '' && (earnTab === 'All' || earnTab === 'Passive')) {
        rewardsResponse = yield call(api.getEarnTransactions, {
          currency: coin,
          nextPageUrl: rewardsNextPageUrl,
          product: 'SAVINGS'
        })
      }

      // if staking nextpage is not empty and the filter tab selected either All or Active in earn/history
      if (
        stakingNextPageUrl !== '' &&
        isStakingEnabled &&
        (earnTab === 'All' || earnTab === 'Staking')
      ) {
        stakingResponse = yield call(api.getEarnTransactions, {
          currency: coin,
          nextPageUrl: stakingNextPageUrl,
          product: STAKING_API_PRODUCT
        })
      }

      // if active rewards nextpage is not empty and the filter tab selected either All or Active in earn/history
      if (
        activeRewardsNextPageUrl !== '' &&
        isActiveRewardsEnabled &&
        (earnTab === 'All' || earnTab === 'Active')
      ) {
        activeRewardsResponse = yield call(api.getEarnTransactions, {
          currency: coin,
          nextPageUrl: activeRewardsNextPageUrl,
          product: ACTIVE_REWARDS_API_PRODUCT
        })
      }

      const mapProductToItems = (items, product) => {
        return items.map((item) => ({ ...item, product }))
      }

      const transactions: Array<EarnTransactionType> = [
        ...mapProductToItems(rewardsResponse.items, 'Passive'),
        ...mapProductToItems(stakingResponse.items, 'Staking'),
        ...mapProductToItems(activeRewardsResponse.items, 'Active')
      ]

      // count how many responses have transactions
      let counter = 0
      if (rewardsResponse.items.length > 0) counter += 1
      if (stakingResponse.items.length > 0) counter += 1
      if (activeRewardsResponse.items.length > 0) counter += 1

      // check to see if at least 2 of the responses have transactions, if so we want to sort it by date
      if (counter > 1) {
        transactions.sort((a, b) => {
          if (!a.insertedAt || !b.insertedAt) return 0

          return getUnixTime(new Date(b.insertedAt)) - getUnixTime(new Date(a.insertedAt))
        })
      }
      yield put(A.fetchEarnTransactionsSuccess({ reset, transactions }))
      yield put(A.setRewardsTransactionsNextPage({ nextPage: rewardsResponse.next || '' }))
      yield put(A.setStakingTransactionsNextPage({ nextPage: stakingResponse.next || '' }))
      yield put(
        A.setActiveRewardsTransactionsNextPage({ nextPage: activeRewardsResponse.next || '' })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEarnTransactionsFailure(error))
    }
  }

  const fetchEarnTransactionsReport = function* () {
    const reportHeaders = [['Date', 'Type', 'Asset', 'Amount', 'Tx Hash', 'Product']]
    const formatRewardsTxData = (d) => [
      d.insertedAt,
      d.type,
      d.amount?.symbol,
      d.amount?.value,
      d.txHash,
      'Passive'
    ]
    const formatStakingTxData = (d) => [
      d.insertedAt,
      d.type,
      d.amount?.symbol,
      d.amount?.value,
      d.txHash,
      'Staking'
    ]
    const formatActiveRewardsTxData = (d) => [
      d.insertedAt,
      d.type,
      d.amount?.symbol,
      d.amount?.value,
      d.txHash,
      'Staking'
    ]
    let txList = []
    let hasRewardsNext = true
    let nextRewardsPageUrl
    let hasStakingNext = true
    let nextStakingPageUrl
    let hasActiveRewardsNext = true
    let nextActiveRewardsPageUrl
    const { coin } = yield select(selectors.form.getFormValues('earnHistoryCoin'))
    yield put(A.fetchEarnTransactionsReportLoading())
    try {
      while (hasRewardsNext) {
        const { items, next } = yield call(api.getEarnTransactions, {
          currency: coin === 'ALL' ? undefined : coin,
          nextPageUrl: nextRewardsPageUrl,
          product: 'SAVINGS'
        })
        txList = concat(txList, items.map(formatRewardsTxData))
        hasRewardsNext = next
        nextRewardsPageUrl = next
      }
      while (hasStakingNext) {
        const { items, next } = yield call(api.getEarnTransactions, {
          currency: coin === 'ALL' ? undefined : coin,
          nextPageUrl: nextStakingPageUrl,
          product: STAKING_API_PRODUCT
        })
        txList = concat(txList, items.map(formatStakingTxData))
        hasStakingNext = next
        nextStakingPageUrl = next
      }
      while (hasActiveRewardsNext) {
        const { items, next } = yield call(api.getEarnTransactions, {
          currency: coin === 'ALL' ? undefined : coin,
          nextPageUrl: nextActiveRewardsPageUrl,
          product: ACTIVE_REWARDS_API_PRODUCT
        })
        txList = concat(txList, items.map(formatActiveRewardsTxData))
        hasActiveRewardsNext = next
        nextActiveRewardsPageUrl = next
      }
      // sort txList by descending date
      txList.sort((a, b) => {
        const dateA = a[0]
        const dateB = b[0]
        if (!dateA || !dateB) return 0

        return getUnixTime(new Date(dateB)) - getUnixTime(new Date(dateA))
      })

      // TODO figure out any replacement type
      const report = concat(reportHeaders, txList) as any
      yield put(A.fetchEarnTransactionsReportSuccess(report))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEarnTransactionsReportFailure(error))
    }
  }

  const fetchPendingStakingTransactions = function* ({
    payload
  }: ReturnType<typeof A.fetchPendingStakingTransactions>) {
    const { coin } = payload
    try {
      yield put(A.fetchPendingStakingTransactionsLoading())
      const transactionResponse: EarnTransactionResponseType = yield call(api.getEarnTransactions, {
        currency: coin,
        product: STAKING_API_PRODUCT
      })
      // can successfully return ''
      const earnBondingResponse: EarnBondingDepositsResponseType = yield call(
        api.getEarnBondingDeposits,
        {
          ccy: coin,
          product: STAKING_API_PRODUCT
        }
      )

      const bondingDeposits: EarnBondingDepositsType[] = earnBondingResponse?.bondingDeposits || []

      const unbondingWithdrawals: EarnUnbondingWithdrawalsType[] =
        earnBondingResponse?.unbondingWithdrawals || []

      const filteredTransactions: TransactionType[] =
        transactionResponse?.items.filter(({ state }) => state.includes('PENDING')) || []

      const pendingTransactions: PendingTransactionType[] = []

      filteredTransactions.forEach(({ amount, insertedAt }) => {
        const baseAmount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin,
          value: new BigNumber(amount.value).toNumber()
        })
        pendingTransactions.push({ amount: baseAmount, date: insertedAt, type: 'TRANSACTIONS' })
      })

      let totalBondingAmount = 0

      bondingDeposits.forEach(({ amount, bondingDays, bondingStartDate }) => {
        totalBondingAmount += Number(amount)
        pendingTransactions.push({ amount, bondingDays, date: bondingStartDate, type: 'BONDING' })
      })

      unbondingWithdrawals.forEach(({ amount, unbondingDays, unbondingStartDate }) => {
        pendingTransactions.push({
          amount,
          date: unbondingStartDate,
          type: 'UNBONDING',
          unbondingDays
        })
      })

      if (totalBondingAmount > 0) yield put(A.setTotalStakingBondingDeposits(totalBondingAmount))

      if (pendingTransactions.length > 0) {
        pendingTransactions.sort((a, b) => {
          if (!a.date || !b.date) return 0

          return getUnixTime(new Date(b.date)) - getUnixTime(new Date(a.date))
        })
      }
      yield put(A.fetchPendingStakingTransactionsSuccess(pendingTransactions))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchPendingStakingTransactionsFailure(error))
    }
  }

  const fetchPendingActiveRewardsTransactions = function* ({
    payload
  }: ReturnType<typeof A.fetchPendingActiveRewardsTransactions>) {
    const { coin } = payload

    try {
      yield put(A.fetchPendingActiveRewardsTransactionsLoading())
      const transactionResponse: EarnTransactionResponseType = yield call(api.getEarnTransactions, {
        currency: coin,
        product: ACTIVE_REWARDS_API_PRODUCT
      })
      // can successfully return ''
      const earnBondingResponse: EarnBondingDepositsResponseType = yield call(
        api.getEarnBondingDeposits,
        {
          ccy: coin,
          product: ACTIVE_REWARDS_API_PRODUCT
        }
      )

      const bondingDeposits: EarnBondingDepositsType[] = earnBondingResponse?.bondingDeposits || []

      const filteredTransactions: TransactionType[] =
        transactionResponse?.items.filter(({ state }) => state.includes('PENDING')) || []

      const pendingTransactions: PendingTransactionType[] = []

      filteredTransactions.forEach(({ amount, insertedAt }) => {
        const baseAmount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin,
          value: new BigNumber(amount.value).toNumber()
        })
        pendingTransactions.push({ amount: baseAmount, date: insertedAt, type: 'TRANSACTIONS' })
      })

      let totalBondingAmount = 0

      bondingDeposits.forEach(({ amount, bondingDays, bondingStartDate }) => {
        totalBondingAmount += Number(amount)
        pendingTransactions.push({ amount, bondingDays, date: bondingStartDate, type: 'BONDING' })
      })

      if (totalBondingAmount > 0)
        yield put(A.setTotalActiveRewardsBondingDeposits(totalBondingAmount))

      if (pendingTransactions.length > 0) {
        pendingTransactions.sort((a, b) => {
          if (!a.date || !b.date) return 0

          return getUnixTime(new Date(b.date)) - getUnixTime(new Date(a.date))
        })
      }
      yield put(A.fetchPendingActiveRewardsTransactionsSuccess(pendingTransactions))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchPendingActiveRewardsTransactionsFailure(error))
    }
  }

  const formChanged = function* (action: FormAction) {
    const { form } = action.meta
    let product: EarnProductsType = 'Passive'

    switch (form) {
      case ACTIVE_REWARDS_DEPOSIT_FORM:
        product = 'Active'
        break
      case STAKING_DEPOSIT_FORM:
        product = 'Staking'
        break
      case PASSIVE_REWARDS_DEPOSIT_FORM:
      default:
        product = 'Passive'
        break
    }

    if (
      ![ACTIVE_REWARDS_DEPOSIT_FORM, STAKING_DEPOSIT_FORM, PASSIVE_REWARDS_DEPOSIT_FORM].includes(
        form
      )
    )
      return

    try {
      const formValues: RewardsDepositFormType | StakingDepositFormType = yield select(
        selectors.form.getFormValues(form)
      )
      const coin = S.getCoinType(yield select())
      const rates = S.getRates(yield select()).getOrElse({} as RatesType)
      const rate = rates.price
      const isNonCustodialAccountSelected =
        prop('type', formValues.earnDepositAccount) === 'ACCOUNT'

      switch (action.meta.field) {
        case 'depositAmount':
          if (!isNonCustodialAccountSelected) {
            return yield put(A.setPaymentSuccess({ payment: undefined }))
          }
          const isAmountDisplayedInCrypto = S.getIsAmountDisplayedInCrypto(yield select())
          const value = isAmountDisplayedInCrypto
            ? new BigNumber(action.payload).toNumber()
            : new BigNumber(action.payload).dividedBy(rate).toNumber()

          const paymentR = S.getPayment(yield select())
          if (paymentR) {
            let payment = yield getOrUpdateProvisionalPaymentForCoin(coin, paymentR)
            const paymentAmount = generateProvisionalPaymentAmount(coin, value)
            payment = yield payment.amount(paymentAmount || 0)
            if (formValues.earnDepositAccount.balance > 0) {
              payment = yield payment.build()
              yield put(A.setPaymentSuccess({ payment: payment.value() }))
            } else {
              yield put(A.setPaymentSuccess({ payment: payment.value() }))
            }
          }
          break
        case 'earnDepositAccount':
          // focus amount to ensure deposit amount validation will be triggered
          yield put(actions.form.focus(form, 'depositAmount'))
          // custodial account selected
          if (!isNonCustodialAccountSelected) {
            const custodialBalances: BSBalancesType = (yield select(
              selectors.components.buySell.getBSBalances
            )).getOrFail('Failed to get balance')
            yield call(createLimits, { custodialBalances, product })
            yield put(A.setPaymentSuccess({ payment: undefined }))
          } else {
            // noncustodial account selected
            const payment: PaymentValue = yield call(createPayment, {
              ...formValues.earnDepositAccount,
              address: getAccountIndexOrAccount(coin, formValues.earnDepositAccount)
            })
            yield call(createLimits, { payment, product })
            yield put(A.setPaymentSuccess({ payment }))
          }
          break
        default:
        // do nothing
      }
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const handleTransferMaxAmountClick = function* ({
    payload: { amount, formName }
  }: ReturnType<typeof A.handleTransferMaxAmountClick>) {
    yield put(actions.form.change(formName, 'depositAmount', amount))
  }

  const handleTransferMinAmountClick = function* ({
    payload: { amount, formName }
  }: ReturnType<typeof A.handleTransferMinAmountClick>) {
    yield put(actions.form.change(formName, 'depositAmount', amount))
  }

  const initializeCustodialAccountForm = function* ({ coin, product }) {
    // re-fetch the custodial balances to ensure we have the latest for proper form initialization
    yield put(actions.components.buySell.fetchBalance({ skipLoading: true }))
    // wait until balances are loaded we must have deep equal objects to initialize form correctly
    yield take([
      actions.components.buySell.fetchBalanceSuccess.type,
      actions.components.buySell.fetchBalanceFailure.type
    ])
    const custodialBalances = (yield select(selectors.components.buySell.getBSBalances)).getOrFail(
      'Failed to get balances'
    )
    const custodialAccount = (yield call(getCustodialAccountForCoin, coin)).getOrFail(
      'Failed to fetch account'
    )
    yield call(createLimits, { custodialBalances, product })
    yield put(A.setPaymentSuccess({ payment: undefined }))

    return custodialAccount
  }

  const initializeNonCustodialAccountForm = function* ({ coin, product }) {
    // fetch deposit address to build provisional payment
    let depositAddr
    switch (product) {
      case 'Staking':
        depositAddr = yield select(S.getStakingDepositAddress)
        break
      case 'Active':
        depositAddr = yield select(S.getActiveRewardsDepositAddress)
        break
      case 'Passive':
      default:
        depositAddr = yield select(S.getRewardsDepositAddress)
        break
    }

    // abort if deposit address missing
    if (isEmpty(depositAddr) || isNil(depositAddr)) {
      throw new Error('Missing deposit address')
    }
    const depositAddress = depositAddr.split(':')[0]
    // fetch default account
    const noncustodialAccount = yield call(getDefaultAccountForCoin, coin)
    // create provisional payment
    const payment: PaymentValue = yield call(createPayment, {
      ...noncustodialAccount,
      address: getAccountIndexOrAccount(coin, noncustodialAccount)
    })
    let newPayment = yield getOrUpdateProvisionalPaymentForCoin(coin, Remote.of(payment))
    newPayment = yield newPayment.to(depositAddress, 'ADDRESS')
    newPayment = yield newPayment.value()
    yield call(createLimits, { payment: newPayment, product })
    yield put(A.setPaymentSuccess({ payment: newPayment }))

    return noncustodialAccount
  }
  const initializeInterestDepositForm = function* ({
    payload
  }: ReturnType<typeof A.initializeInterestDepositForm>) {
    const { coin, currency } = payload
    const coins = yield select(selectors.core.data.coins.getCoins)
    const coinfig = coins[coin]?.coinfig
    let initialAccount

    try {
      yield put(A.fetchRewardsAccount({ coin }))
      yield take([A.fetchRewardsAccountSuccess.type, A.fetchRewardsAccountFailure.type])
      yield put(A.setPaymentLoading())
      yield put(A.fetchInterestLimits({ coin, currency }))
      yield take([A.fetchInterestLimitsSuccess.type, A.fetchInterestLimitsFailure.type])

      // initialize the form depending upon account types for coin
      if (coinfig.products.includes('PrivateKey')) {
        initialAccount = yield call(initializeNonCustodialAccountForm, { coin, product: 'Passive' })
      } else {
        initialAccount = yield call(initializeCustodialAccountForm, { coin, product: 'Passive' })
      }

      // finally, initialize the form
      yield put(
        initialize(PASSIVE_REWARDS_DEPOSIT_FORM, {
          coin,
          currency,
          earnDepositAccount: initialAccount
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const initializeStakingDepositForm = function* ({
    payload
  }: ReturnType<typeof A.initializeStakingDepositForm>) {
    const { coin, currency } = payload
    const coins = yield select(selectors.core.data.coins.getCoins)
    const coinfig = coins[coin]?.coinfig
    let initialAccount

    try {
      yield put(A.fetchStakingAccount({ coin }))
      yield take([A.fetchStakingAccountSuccess.type, A.fetchStakingAccountFailure.type])
      yield put(A.setPaymentLoading())
      yield put(A.fetchStakingLimits())
      yield take([A.fetchStakingLimitsSuccess.type, A.fetchStakingLimitsFailure.type])
      // initialize the form depending upon account types for coin
      if (coinfig.products.includes('PrivateKey')) {
        initialAccount = yield call(initializeNonCustodialAccountForm, { coin, product: 'Staking' })
      } else {
        initialAccount = yield call(initializeCustodialAccountForm, { coin, product: 'Staking' })
      }

      // finally, initialize the form
      yield put(
        initialize(STAKING_DEPOSIT_FORM, {
          coin,
          currency,
          earnDepositAccount: initialAccount
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const initializeActiveRewardsDepositForm = function* ({
    payload
  }: ReturnType<typeof A.initializeActiveRewardsDepositForm>) {
    const { coin, currency } = payload

    try {
      yield put(A.fetchActiveRewardsAccount({ coin }))
      yield take([A.fetchActiveRewardsAccountSuccess.type, A.fetchActiveRewardsAccountFailure.type])
      yield put(A.setPaymentLoading())
      yield put(A.fetchActiveRewardsLimits())
      yield take([A.fetchActiveRewardsLimitsSuccess.type, A.fetchActiveRewardsLimitsFailure.type])

      // initialize the form depending upon account types for coin
      const initialAccount = yield call(initializeCustodialAccountForm, {
        coin,
        product: 'Active'
      })

      // finally, initialize the form
      yield put(
        initialize(ACTIVE_REWARDS_DEPOSIT_FORM, {
          coin,
          currency,
          earnDepositAccount: initialAccount
        })
      )
    } catch (e) {
      yield put(A.setPaymentFailure(e))
    }
  }

  const initializeWithdrawalForm = function* ({
    payload
  }: ReturnType<typeof A.initializeWithdrawalForm>) {
    const { coin, formName, hidePkWallets, walletCurrency } = payload
    const coins = yield select(selectors.core.data.coins.getCoins)
    const coinfig = coins[coin]?.coinfig
    let defaultAccount
    try {
      yield put(A.setWithdrawalMinimumsLoading())
      const withdrawalMinimumsResponse: ReturnType<typeof api.getWithdrawalMinsAndFees> =
        yield call(api.getWithdrawalMinsAndFees, 'savings')
      if (coinfig.products.includes('PrivateKey') && !hidePkWallets) {
        defaultAccount = yield call(getDefaultAccountForCoin, coin)
      } else {
        defaultAccount = (yield call(getCustodialAccountForCoin, coin)).getOrFail(
          'Failed to fetch account'
        )
      }

      yield put(
        initialize(formName, {
          coin,
          currency: walletCurrency
        })
      )
      yield put(A.setWithdrawalMinimumsSuccess({ withdrawalMinimumsResponse }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.setWithdrawalMinimumsFailure({ error }))
    }
  }

  const routeToTxHash = function* ({ payload }: ReturnType<typeof A.routeToTxHash>) {
    const { coin, txHash } = payload
    yield put(actions.router.push(`/coins/${coin}`))
    yield delay(1000)
    yield put(actions.form.change('walletTxSearch', 'search', txHash))
  }

  const sendDeposit = function* ({ payload }: ReturnType<typeof A.submitDepositForm>) {
    const { formName } = payload
    let hotWalletAddressProduct = 'rewards'
    let product: EarnProductsType = 'Passive'
    let destination: NabuCustodialProductType = 'SAVINGS'
    switch (formName) {
      case ACTIVE_REWARDS_DEPOSIT_FORM:
        product = 'Active'
        hotWalletAddressProduct = 'active'
        destination = ACTIVE_REWARDS_API_PRODUCT
        break
      case STAKING_DEPOSIT_FORM:
        product = 'Staking'
        hotWalletAddressProduct = 'staking'
        destination = STAKING_API_PRODUCT
        break
      case PASSIVE_REWARDS_DEPOSIT_FORM:
      default:
        product = 'Passive'
        hotWalletAddressProduct = 'rewards'
        destination = 'SAVINGS'
        break
    }

    try {
      yield put(actions.form.startSubmit(formName))
      const formValues: RewardsDepositFormType | StakingDepositFormType = yield select(
        selectors.form.getFormValues(formName)
      )
      const isCustodialDeposit = formValues.earnDepositAccount.type === 'CUSTODIAL'
      const coin = S.getCoinType(yield select())

      // custodial account deposit
      if (isCustodialDeposit) {
        const { depositAmount } = formValues
        const isAmountDisplayedInCrypto = S.getIsAmountDisplayedInCrypto(yield select())
        const rates = S.getRates(yield select()).getOrElse({} as RatesType)
        const rate = rates.price
        const baseCrypto = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin,
          value: isAmountDisplayedInCrypto
            ? new BigNumber(depositAmount).toNumber()
            : new BigNumber(depositAmount).dividedBy(rate).toNumber()
        })

        const amount = new BigNumber(baseCrypto).integerValue(BigNumber.ROUND_DOWN).toFixed()

        yield call(api.initiateCustodialTransfer, {
          amount,
          currency: coin,
          destination,
          origin: 'SIMPLEBUY'
        })
      } else {
        // non-custodial account deposit
        // get payment
        const paymentR = S.getPayment(yield select())
        const payment = yield getOrUpdateProvisionalPaymentForCoin(
          coin,
          paymentR as RemoteDataType<string, any>
        )
        // fetch deposit address
        let depositAddress
        switch (product) {
          case 'Active':
            yield put(A.fetchActiveRewardsAccount({ coin }))
            yield take([A.fetchActiveRewardsAccountSuccess.type, A.fetchStakingAccountFailure.type])
            depositAddress = yield select(S.getActiveRewardsDepositAddress)
            break
          case 'Staking':
            yield put(A.fetchStakingAccount({ coin }))
            yield take([A.fetchStakingAccountSuccess.type, A.fetchStakingAccountFailure.type])
            depositAddress = yield select(S.getStakingDepositAddress)
            break

          case 'Passive':
          default:
            yield put(A.fetchRewardsAccount({ coin }))
            yield take([A.fetchRewardsAccountSuccess.type, A.fetchRewardsAccountFailure.type])
            depositAddress = yield select(S.getRewardsDepositAddress)
            break
        }

        // abort if deposit address missing
        if (isEmpty(depositAddress) || isNil(depositAddress)) {
          throw new Error('Missing deposit address')
        }

        const hotWalletAddress = selectors.core.walletOptions
          .getHotWalletAddresses(yield select(), Product[hotWalletAddressProduct])
          .getOrElse(null)
        let transaction
        if (typeof hotWalletAddress !== 'string') {
          console.error('Unable to retreive hotwallet address; falling back to deposit and sweep.')
          transaction = yield call(buildAndPublishPayment, coin, payment, depositAddress)
        } else {
          // build and publish payment to network
          transaction = yield call(
            buildAndPublishPayment,
            coin,
            payment,
            depositAddress,
            hotWalletAddress
          )
        }

        // notify backend of incoming non-custodial deposit
        yield put(
          actions.components.send.notifyNonCustodialToCustodialTransfer(
            { ...transaction, fromType: 'ADDRESS' },
            destination
          )
        )
      }

      // notify UI of success
      yield put(actions.form.stopSubmit(formName))

      switch (product) {
        case 'Active':
          yield put(A.setActiveRewardsStep({ name: 'DEPOSIT_SUCCESS' }))
          break
        case 'Staking':
          yield put(A.setStakingStep({ name: 'DEPOSIT_SUCCESS' }))
          break
        case 'Passive':
        default:
          yield put(A.setRewardsStep({ data: { depositSuccess: true }, name: 'ACCOUNT_SUMMARY' }))
          break
      }

      const afterTransactionR = yield select(selectors.components.interest.getAfterTransaction)
      const afterTransaction = afterTransactionR.getOrElse({
        show: false
      } as EarnAfterTransactionType)
      if (afterTransaction?.show) {
        yield put(actions.components.interest.resetShowInterestCardAfterTransaction())
      }

      yield delay(3000)

      switch (product) {
        case 'Active':
          yield put(A.fetchActiveRewardsBalance())
          break
        case 'Staking':
          yield put(A.fetchStakingBalance())
          break
        case 'Passive':
        default:
          yield put(A.fetchRewardsBalance())
          break
      }

      yield put(A.fetchEDDStatus())
    } catch (e) {
      const error = errorHandler(e)
      switch (product) {
        case 'Active':
          yield put(actions.form.stopSubmit(ACTIVE_REWARDS_DEPOSIT_FORM, { _error: error }))
          yield put(
            A.setActiveRewardsStep({
              data: {
                depositSuccess: false,
                error
              },
              name: 'ACCOUNT_SUMMARY'
            })
          )
          break
        case 'Staking':
          yield put(actions.form.stopSubmit(STAKING_DEPOSIT_FORM, { _error: error }))
          yield put(
            A.setStakingStep({
              data: {
                depositSuccess: false,
                error
              },
              name: 'ACCOUNT_SUMMARY'
            })
          )
          break
        case 'Passive':
        default:
          yield put(actions.form.stopSubmit(PASSIVE_REWARDS_DEPOSIT_FORM, { _error: error }))
          yield put(
            A.setRewardsStep({
              data: {
                depositSuccess: false,
                error
              },
              name: 'ACCOUNT_SUMMARY'
            })
          )
          break
      }
    }
  }

  const requestActiveRewardsWithdrawal = function* ({
    payload
  }: ReturnType<typeof A.requestActiveRewardsWithdrawal>) {
    const { coin, withdrawalAmountCrypto } = payload
    const isActiveRewardsWithdrawalEnabled = selectors.core.walletOptions
      .getActiveRewardsWithdrawalEnabled(yield select())
      .getOrElse(false) as boolean

    if (!isActiveRewardsWithdrawalEnabled) return
    try {
      const withdrawalAmountBase = convertStandardToBase(coin, withdrawalAmountCrypto)
      yield call(api.initiateCustodialTransfer, {
        amount: withdrawalAmountBase,
        currency: coin,
        destination: 'SIMPLEBUY',
        origin: 'EARN_CC1W'
      })
      yield put(
        A.setActiveRewardsStep({
          name: 'WITHDRAWAL_REQUESTED'
        })
      )
      yield delay(3000)
      yield put(A.fetchRewardsBalance())
      yield put(A.fetchEDDStatus())
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.setActiveRewardsStep({ name: 'ACCOUNT_SUMMARY' }))
    }
  }

  const requestStakingWithdrawal = function* ({
    payload
  }: ReturnType<typeof A.requestStakingWithdrawal>) {
    const { coin, fix, formName, walletCurrency, withdrawalAmount } = payload
    const isStakingWithdrawalEnabled = selectors.core.walletOptions
      .getStakingWithdrawalEnabled(yield select())
      .getOrElse(false) as boolean
    const rates = S.getRates(yield select()).getOrElse({} as RatesType)

    if (!isStakingWithdrawalEnabled) return
    try {
      yield put(actions.form.startSubmit(formName))
      const withdrawalAmountCrypto =
        fix === 'FIAT'
          ? Exchange.convertFiatToCoin({
              coin,
              currency: walletCurrency,
              maxPrecision: 18,
              rates,
              value: new BigNumber(withdrawalAmount).toNumber()
            })
          : new BigNumber(withdrawalAmount).toNumber()
      const withdrawalAmountBase = new BigNumber(
        convertStandardToBase(coin, withdrawalAmountCrypto)
      )
        .integerValue(BigNumber.ROUND_DOWN)
        .toFixed()
      yield call(api.initiateCustodialTransfer, {
        amount: withdrawalAmountBase,
        currency: coin,
        destination: 'SIMPLEBUY',
        origin: 'STAKING'
      })
      yield put(A.setStakingStep({ name: 'WITHDRAWAL_REQUESTED' }))
      yield delay(3000)
      yield put(A.fetchStakingBalance())
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.setActiveRewardsStep({ name: 'ACCOUNT_SUMMARY' }))
    }
  }

  const requestWithdrawal = function* ({ payload }: ReturnType<typeof A.requestWithdrawal>) {
    const { coin, destination, formName, origin, withdrawalAmountCrypto, withdrawalAmountFiat } =
      payload
    try {
      yield put(actions.form.startSubmit(formName))
      const withdrawalAmountBase = convertStandardToBase(coin, withdrawalAmountCrypto)

      yield call(api.initiateCustodialTransfer, {
        amount: withdrawalAmountBase,
        currency: coin,
        destination,
        origin
      })

      // notify success
      yield put(actions.form.stopSubmit(formName))
      yield put(
        A.setRewardsStep({
          data: {
            withdrawSuccess: true,
            withdrawalAmount: withdrawalAmountFiat
          },
          name: 'ACCOUNT_SUMMARY'
        })
      )
      yield delay(3000)
      yield put(A.fetchRewardsBalance())
      yield put(A.fetchEDDStatus())
    } catch (e) {
      const error = errorHandler(e)
      yield put(actions.form.stopSubmit(formName, { _error: error }))
      yield put(
        A.setRewardsStep({ data: { error, withdrawSuccess: false }, name: 'ACCOUNT_SUMMARY' })
      )
    }
  }

  const showActiveRewardsModal = function* ({ payload }: ReturnType<typeof A.showInterestModal>) {
    const { coin, step } = payload
    yield put(A.setActiveRewardsStep({ name: step }))
    yield put(
      actions.modals.showModal(ModalName.ACTIVE_REWARDS_MODAL, {
        coin,
        origin: 'EarnPage'
      })
    )
  }

  const showInterestModal = function* ({ payload }: ReturnType<typeof A.showInterestModal>) {
    const { coin, step } = payload
    yield put(A.setRewardsStep({ name: step }))
    yield put(
      actions.modals.showModal(ModalName.INTEREST_MODAL, {
        coin,
        origin: 'EarnPage'
      })
    )
  }

  const showStakingModal = function* ({ payload }: ReturnType<typeof A.showStakingModal>) {
    const { coin, step } = payload
    yield put(A.setStakingModal({ name: step }))
    yield put(
      actions.modals.showModal(ModalName.STAKING_MODAL, {
        coin,
        origin: 'EarnPage'
      })
    )
  }

  const fetchShowInterestCardAfterTransaction = function* ({
    payload
  }: ReturnType<typeof A.fetchShowInterestCardAfterTransaction>) {
    try {
      yield put(A.fetchShowInterestCardAfterTransactionLoading())
      const afterTransaction: EarnAfterTransactionType = yield call(
        api.getInterestCtaAfterTransaction,
        payload.currency
      )
      yield put(A.fetchShowInterestCardAfterTransactionSuccess({ afterTransaction }))
    } catch (e) {
      // TODO: Make this error not break the order summary page. This is failing with the new card providers
      // const error = errorHandler(e)
      // yield put(A.fetchShowInterestCardAfterTransactionFailure({ error }))
      yield put(
        A.fetchShowInterestCardAfterTransactionSuccess({
          // @ts-ignore
          afterTransaction: {
            show: false
          }
        })
      )
    }
  }

  const stopShowingInterestModal = function* () {
    try {
      yield call(api.stopInterestCtaAfterTransaction, false)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'INTEREST_PROMO_MODAL', e))
    }
    yield put(actions.modals.closeModal(ModalName.INTEREST_PROMO_MODAL))
  }

  const fetchEDDStatus = function* () {
    try {
      yield put(A.fetchEDDStatusLoading())
      const eddStatus: ReturnType<typeof api.getSavingsEDDStatus> = yield call(
        api.getSavingsEDDStatus
      )
      yield put(A.fetchEDDStatusSuccess({ eddStatus }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEDDStatusFailure({ error }))
    }
  }
  const fetchEDDWithdrawLimits = function* ({
    payload
  }: ReturnType<typeof A.fetchEDDWithdrawLimits>) {
    try {
      yield put(A.fetchEDDWithdrawLimitsLoading())
      const earnEDDWithdrawLimits: ReturnType<typeof api.getSavingsEDDWithdrawLimits> = yield call(
        api.getSavingsEDDWithdrawLimits,
        payload.currency
      )
      yield put(A.fetchEDDWithdrawLimitsSuccess({ earnEDDWithdrawLimits }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEDDWithdrawLimitsFailure({ error }))
    }
  }
  const fetchEDDDepositLimits = function* ({
    payload
  }: ReturnType<typeof A.fetchEDDDepositLimits>) {
    try {
      yield put(A.fetchEDDDepositLimitsLoading())
      const rewardsEDDDepositLimits: ReturnType<typeof api.getSavingsEDDDepositLimits> = yield call(
        api.getSavingsEDDDepositLimits,
        payload.currency
      )
      yield put(A.fetchEDDDepositLimitsSuccess({ rewardsEDDDepositLimits }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchEDDWithdrawLimitsFailure({ error }))
    }
  }

  return {
    fetchActiveRewardsAccount,
    fetchActiveRewardsBalance,
    fetchActiveRewardsEligible,
    fetchActiveRewardsLimits,
    fetchActiveRewardsRates,
    fetchEDDDepositLimits,
    fetchEDDStatus,
    fetchEDDWithdrawLimits,
    fetchEarnInstruments,
    fetchEarnTransactions,
    fetchEarnTransactionsReport,
    fetchInterestEligible,
    fetchInterestLimits,
    fetchInterestRates,
    fetchPendingActiveRewardsTransactions,
    fetchPendingStakingTransactions,
    fetchRewardsAccount,
    fetchRewardsBalance,
    fetchShowInterestCardAfterTransaction,
    fetchStakingAccount,
    fetchStakingBalance,
    fetchStakingEligible,
    fetchStakingLimits,
    fetchStakingRates,
    fetchStakingWithdrawals,
    formChanged,
    handleTransferMaxAmountClick,
    handleTransferMinAmountClick,
    initializeActiveRewardsDepositForm,
    initializeInterestDepositForm,
    initializeStakingDepositForm,
    initializeWithdrawalForm,
    requestActiveRewardsWithdrawal,
    requestStakingWithdrawal,
    requestWithdrawal,
    routeToTxHash,
    sendDeposit,
    showActiveRewardsModal,
    showInterestModal,
    showStakingModal,
    stopShowingInterestModal
  }
}
