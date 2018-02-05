import { call, apply, select, takeLatest } from 'redux-saga/effects'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellAT from '../../kvStore/buySell/actionTypes'
import * as delegate from '../../../exchange/delegate'
import SFOX from 'bitcoin-sfox-client'
import * as AT from './actionTypes'
import * as A from './actions'
let sfox

export default ({ api } = {}) => {
  const init = function * () {
    try {
      const value = yield select(buySellSelectors.getMetadata)
      sfox = new SFOX(value.data.value.sfox, delegate)
      sfox.api.production = true
      sfox.api.apiKey = '6fbfb80536564af8bbedb7e3be4ec439'
    } catch (e) {
      throw new Error(e)
    }
  }

  const fetchQuote = function * (data) {
    try {
      const { amt, baseCurr, quoteCurr } = data.payload
      const quote = yield apply(sfox, sfox.getBuyQuote, [amt, baseCurr, quoteCurr])
      console.log(quote)
    } catch (e) {
      throw new Error(e)
    }
  }

  return function * () {
    yield takeLatest(buySellAT.FETCH_METADATA_BUYSELL_SUCCESS, init)
    yield takeLatest(AT.FETCH_QUOTE, fetchQuote)
  }
}
