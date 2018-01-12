import { channelSagas } from './channel/sagas.js'

export const lnSagasFactory = (tcp) => ({
  channel: channelSagas(tcp)
})
