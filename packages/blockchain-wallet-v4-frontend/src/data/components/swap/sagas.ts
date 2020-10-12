import * as A from './actions'
import { actions } from 'data'
import { put } from 'redux-saga/effects'

export default () => {
  const showModal = function * ({ payload }: ReturnType<typeof A.showModal>) {
    const { origin, baseCurrency, counterCurrency } = payload
    yield put(
      actions.modals.showModal('SWAP_MODAL', {
        origin,
        baseCurrency,
        counterCurrency
      })
    )
  }

  return {
    showModal
  }
}
