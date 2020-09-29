import { call } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { NabuCustodialProductType } from 'core/types'

export default ({ api }: { api: APIType }) => {
  const fetchActivity = function * () {
    try {
      const products: Array<NabuCustodialProductType> = [
        'SAVINGS',
        'SIMPLEBUY',
        'SWAP'
      ]
      for (const value of products) {
        try {
          const transactions = yield call(api.getCustodialTxs, value)
          console.log(transactions)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return {
    fetchActivity
  }
}
