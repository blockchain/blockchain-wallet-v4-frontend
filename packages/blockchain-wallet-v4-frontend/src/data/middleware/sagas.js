import webSocket from './webSocket/sagas'

export default ({ api, bchSocket, btcSocket, ethSocket }) => ({
  webSocket: webSocket({ api, bchSocket, btcSocket, ethSocket })
})
