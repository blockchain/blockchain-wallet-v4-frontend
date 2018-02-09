import { channelSagas } from './channel/sagas.js'
import { peerSagas } from './peers/sagas'
import {LNRootSagas} from './root/sagas'
import {paymentRequestSagas} from './payment/sagas'
import {createApiWallet} from './channel/walletAbstraction';
import {routeSagas} from './route/sagas';
import { lnApiSagas } from './api/sagas'

export const lnSagasFactory = (api, tcp) => {
  let routeSaga = routeSagas('http://localhost:8081')
  let peerSaga = peerSagas(tcp)
  let channelSaga = channelSagas(api, createApiWallet(api), peerSaga, routeSaga)
  let rootSaga = LNRootSagas()
  let paymentSaga = paymentRequestSagas()
  let apiSaga = lnApiSagas(channelSaga, peerSaga)

  return {
    peer: peerSaga.takeSagas,
    channel: channelSaga.takeSagas,
    root: rootSaga.takeSagas,
    payment: paymentSaga.takeSagas,
    api: apiSaga.takeSagas
  }
}
