import { equals, path, prop } from 'ramda'
import { put, select } from 'redux-saga/effects'

import { actions, model } from 'data'

import * as S from './selectors'

export const logLocation = 'components/bchTransactions/sagas'

export default () => {
  const { WALLET_TX_SEARCH } = model.form

  const initialized = function * () {
    try {
      const defaultSource = 'all'
      const initialValues = {
        source: defaultSource,
        status: '',
        search: ''
      }
      yield put(actions.form.initialize(WALLET_TX_SEARCH, initialValues))
      yield put(actions.core.data.bch.fetchTransactions('', true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function * () {
    try {
      const onlyShow = yield select(S.selectOnlyShow)
      yield put(actions.core.data.bch.fetchTransactions(onlyShow, false))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals(WALLET_TX_SEARCH, form)) return

      switch (field) {
        case 'source':
          const onlyShow = yield select(S.selectOnlyShow, payload)
          yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
          break
        case 'status':
          const filter = payload => {
            switch (payload) {
              case 'sent':
                return 1
              case 'received':
                return 2
              case 'transferred':
                return 3
              default:
                break
            }
          }
          yield put(
            actions.core.data.bch.fetchTransactions(
              onlyShow,
              true,
              filter(payload)
            )
          )
          break
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  return {
    initialized,
    formChanged,
    loadMore
  }
}
