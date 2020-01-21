import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { BorrowActionTypes } from './types'
import { initialize } from 'redux-form'
import { nth } from 'ramda'
import { put, select } from 'redux-saga/effects'
import { selectors } from 'data'

export default ({ api, coreSagas, networks }) => {
  const initializeBorrow = function * ({
    payload
  }: BorrowActionTypes): ReturnType<typeof initializeBorrow> {
    let payment
    let defaultAccountR

    switch (payload.coin) {
      case 'BTC':
        payment = coreSagas.payment.btc.create({
          network: networks.btc
        })
        payment = yield payment.init()
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        payment = yield payment.fee('priority')
        break
    }

    const initialValues = {
      collateral: defaultAccountR.getOrElse(),
      maxCollateral: payment.value().effectiveBalance
    }

    yield put(initialize('borrowForm', initialValues))
  }

  return {
    initializeBorrow
  }
}
