import { call, put, select, take } from 'redux-saga/effects'
import { assoc } from 'ramda'
import { Types } from 'blockchain-wallet-v4'
import { actions, actionTypes, selectors } from 'data'

const askSecondPasswordEnhancer = (coreSaga) =>
  function * (args) {
    let enhancedArgs = args
    const wallet = yield select(selectors.core.wallet.getWallet)
    if (Types.Wallet.isDoubleEncrypted(wallet)) {
      yield put(actions.modals.showModal('SecondPassword'))
      const secPassAct = yield take(actionTypes.wallet.SUBMIT_SECOND_PASSWORD)
      const secPass = secPassAct.payload.password
      enhancedArgs = assoc('password', secPass, args)
    }
    yield call(coreSaga, enhancedArgs)
  }

export {
  askSecondPasswordEnhancer
}
