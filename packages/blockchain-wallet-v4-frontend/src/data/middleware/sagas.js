import webSocket from './webSocket/sagas'

export default ({ api, ratesSocket, socketd }) => ({
  webSocket: webSocket({
    api,
    ratesSocket,
    socketd
  })
})
