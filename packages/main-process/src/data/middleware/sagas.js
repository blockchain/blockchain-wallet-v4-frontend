import webSocket from './webSocket/sagas'

export default ({ api, bchSocket, btcSocket, ethSocket, ratesSocket }) => ({
  webSocket: webSocket({ api, bchSocket, btcSocket, ethSocket, ratesSocket })
})
