import { channelSagas } from './channel/sagas.js'
import { peerSagas } from './peers/sagas'

export const lnSagasFactory = (tcp) => ({
  channel: channelSagas(tcp),
  peer : peerSagas(tcp)
})
