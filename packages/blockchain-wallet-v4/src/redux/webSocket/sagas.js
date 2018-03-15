import { bitcoinWebSocketSaga } from './bitcoin/sagas.js'

export const webSocketSaga = ({ api, socket } = {}) => ({
  bitcoin: bitcoinWebSocketSaga({ api, socket })
})
