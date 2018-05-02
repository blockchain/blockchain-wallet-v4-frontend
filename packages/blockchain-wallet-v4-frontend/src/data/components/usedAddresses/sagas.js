import { put } from 'redux-saga/effects'
import * as actions from '../../actions.js'

export default () => {
  const toggleUsedAddresses = function * () {
    yield put(actions.modals.closeAllModals())
  }

  return {
    toggleUsedAddresses
  }
}
