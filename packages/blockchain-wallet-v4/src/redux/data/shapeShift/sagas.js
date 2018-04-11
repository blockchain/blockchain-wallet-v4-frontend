import { call } from 'redux-saga/effects'

export default ({ api } = {}) => {
  const fetchTradeStatus = function * (address) {
    return yield call(api.getTradeStatus, address)
  }

  return {
    fetchTradeStatus
  }
}
