import { call, put, select } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as selectors from './selectors'
import { promptForSecondPassword } from 'services/SagaService'
import settings from 'config'

export default ({ coreSagas }) => {
  const confirmTransferEth = function * (action) {
    try {
      const { to, effectiveBalance } = action.payload
      let p = yield select(selectors.getPayment)
      let payment = coreSagas.payment.eth.create({ payment: p.getOrElse({}), network: settings.NETWORK_ETHEREUM })
      payment = yield payment.to(to)
      const password = yield call(promptForSecondPassword)
      payment = yield payment.amount(effectiveBalance)
      payment = yield payment.build()
      payment = yield payment.signLegacy(password)
      yield payment.publish()
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/eth/transactions'))
      yield put(actions.alerts.displaySuccess('Ether transaction has been successfully published!'))
    } catch (e) {
      yield put(actions.alerts.displayError('Ether transaction could not be published.'))
    }
  }

  return {
    confirmTransferEth
  }
}
