import { channelSagas } from './channel/sagas.js'
import { peerSagas } from './peers/sagas'
import {LNRootSagas} from './root/sagas'
import {paymentRequestSagas} from './payment/sagas'

export const lnSagasFactory = (api, tcp) => {
  let peerSaga = peerSagas(tcp)
  let channel = channelSagas(api, peerSaga)
  let rootSaga = LNRootSagas()
  let paymentSaga = paymentRequestSagas()

  return {
    peer: peerSaga.takeSagas,
    channel: channel.takeSagas,
    root: rootSaga.takeSagas,
    payment: paymentSaga.takeSagas
  }
}
