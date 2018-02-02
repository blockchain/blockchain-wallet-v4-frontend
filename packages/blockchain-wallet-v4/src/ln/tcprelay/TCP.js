import { compose, prop, propEq, identity, pipe } from 'ramda'

const WebSocket = global.WebSocket || global.MozWebSocket

function WS (uri, protocols, opts) {
  return protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)
}

let connections = []
let conn = {}

if (WebSocket) {
  WS.prototype = WebSocket.prototype

  WS.prototype.on = function (event, callback) {
    this['on' + event] = callback
  }

  WS.prototype.once = function (event, callback) {
    this['on' + event] = function () {
      callback.apply(callback, arguments)
      this['on' + event] = null
    }.bind(this)
  }

  WS.prototype.off = function (event) {
    this['on' + event] = null
  }
}

class TCP {
  constructor (options = {}) {
    let {
      wsUrl = 'ws://localhost:8081/proxy'
    } = options
    this.wsUrl = wsUrl
    this.pingInterval = 30000
    this.pingIntervalPID = null
    this.pingTimeout = 5000
    this.pingTimeoutPID = null
    this.reconnect = null
  }

  connectToMaster (
    onOpen = identity,
    onClose = identity,
    onNodeConnected = identity,
    onNodeMessage = identity,
    onNodeDisconnected = identity
  ) {
    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.pingIntervalPID = setInterval(this.ping.bind(this), this.pingInterval)
        this.socket = new WS(this.wsUrl)

        this.socket.on('open', onOpen)
        this.socket.on('message', this.onMessage.bind(this))
        this.socket.on('close', pipe(this.onClose, onClose))

        this.onNodeConnected = onNodeConnected

        this.onNodeMessage = onNodeMessage
        this.onNodeDisconnected = onNodeDisconnected

        this.reconnect = this.connectToMaster.bind(this, onOpen, onClose)
      } catch (e) {
        console.info('Failed to connect to websocket', e)
      }
    }
  }

  connectToNode (pubKey, onOpen = identity, onData = identity, onClose = identity) {
    const pubKeyB64 = pubKey.toString('base64')
    console.log('Connect to ', pubKeyB64)

    connections[pubKeyB64] = {}
    connections[pubKeyB64].onOpen = onOpen
    connections[pubKeyB64].onData = onData
    connections[pubKeyB64].onClose = onClose

    this.send(this.open(pubKeyB64))
    return connections[pubKeyB64]
  }

  connectToNodePromise (node, onData = identity, onClose = identity) {
    return new Promise((resolve, reject) => {
      let close = () => {
        onClose()
        reject(new Error('Connection closed'))
      }
      console.info(this)
      this.connectToNode(node.toString('hex'), resolve, onData, close)
    })
  }

  sendToNode (node, data) {
    this.send(TCP.sendData(node, data))
  }

  ping () {
    this.send(TCP.pingMessage())
    // TODO this closes and reconnects the whole websocket every 30s - ask Jaume how this is supposed to work
    // let close = this.close.bind(this)
    // this.pingTimeoutPID = setTimeout(compose(this.reconnect, close), this.pingTimeout)
  }

  onPong (msg) {
    if (propEq('op', 'pong')) { clearTimeout(this.pingTimeoutPID) }
    return msg
  }

  onClose () {
    for (const key of Object.keys(connections)) {
      connections[key].onClose()
    }
    connections = undefined
  }

  onMessage (msg) {
    // console.info('ws [<-]: ', msg.data)
    let m = JSON.parse(msg.data)

    const node = TCP.extractNode(msg)

    if (m.op === 'pong') {
      this.onPong(msg)
    } else if (m.op === 'event') {
      console.debug('ws [<-]: ', msg.data)
      if (m.event === 'open') {
        connections[node].onOpen()
        this.onNodeConnected(node)
      } else if (m.event === 'close') {
        connections[node].onClose()
        connections[node] = undefined
        this.onNodeDisconnected(node)
      }
    } else {
      if (m.op === 'msg') {
        const payload = TCP.extractPayload(msg)
        connections[node].onData(payload)
        this.onNodeMessage(node, payload)
      }
    }
  }

  static extractPayload (msg) {
    return Buffer.from(JSON.parse(msg.data).msg, 'base64')
  }

  static extractError (msg) {
    return compose(JSON.parse, prop('error'))(msg)
  }

  static extractNode (msg) {
    return JSON.parse(msg.data).node
  }

  close () {
    if (this.socket) this.socket.close()
    this.socket = null
    clearInterval(this.pingIntervalPID)
    clearTimeout(this.pingTimeoutPID)
  }

  send (message) {
    console.debug('ws [->]: ', message)
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(message)
    }
  }

  static sendData (node, data) {
    return JSON.stringify({op: 'msg', node: node.toString('base64'), msg: data.toString('base64')})
  }

  open (node) {
    return JSON.stringify({op: 'open', node: node})
  }

  static pingMessage () {
    return JSON.stringify({op: 'ping'})
  }
}

export default TCP
