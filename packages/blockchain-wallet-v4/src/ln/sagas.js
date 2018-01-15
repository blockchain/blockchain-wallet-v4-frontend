import { channelSagas } from './channel/sagas.js'
import { peerSagas } from './peers/sagas'

export const lnSagasFactory = (api, tcp) => ({
  channel: channelSagas(api, tcp),
  peer: peerSagas(tcp)
})
