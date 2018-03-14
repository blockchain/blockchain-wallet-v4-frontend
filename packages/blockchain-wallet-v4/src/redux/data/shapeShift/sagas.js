import { call } from 'redux-saga/effects'

export const shapeShift = ({ api } = {}) => {
  const fetchTradeStatus = function * (address) {
    return yield call(api.getTradeStatus, address)
  }

  return {
    fetchTradeStatus
  //   fetchBtcEth,
  //   fetchEthBtc,
  //   createOrder,
  //   getTradeStatus,
  //   getTradesStatus
  }
}
