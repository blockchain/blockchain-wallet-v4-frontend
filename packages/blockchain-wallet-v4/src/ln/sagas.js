import { channelSagas } from './channel/sagas.js'
import { peerSagas } from './peers/sagas'

export const lnSagasFactory = (api, tcp) => {
  let peerSaga = peerSagas(tcp)
  let channel = channelSagas(api, peerSaga)

  return {
    peer: peerSaga.takeSagas,
    channel: channel.takeSagas
  }
}
