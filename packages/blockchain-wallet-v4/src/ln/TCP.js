import { compose, prop, propEq, identity, pipe } from 'ramda'

const WebSocket = global.WebSocket || global.MozWebSocket
let Base64 = require('js-base64').Base64

function WS (uri, protocols, opts) {
  return protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)
}

let connections = []

if (WebSocket) {
  console.info('Setup WebSocket 1')
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
  console.info('Setup WebSocket 1 done')
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

  connectToMaster (onOpen = identity, onClose = identity) {
    console.log(WebSocket)

    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.pingIntervalPID = setInterval(this.ping.bind(this), this.pingInterval)
        this.socket = new WS(this.wsUrl)

        this.socket.on('open', onOpen)
        this.socket.on('message', this.onMessage.bind(this))
        this.socket.on('close', pipe(this.onClose, onClose))

        this.reconnect = this.connectToMaster.bind(this, onOpen, onClose)
      } catch (e) {
        console.info('Failed to connect to websocket', e)
      }
    }
  }

  connectToNode (node, onOpen = identity, onData = identity, onClose = identity) {
    console.log('Connect to ', node)

    connections[node] = {}
    connections[node].onOpen = onOpen
    connections[node].onData = onData
    connections[node].onClose = onClose

    this.send(this.open(node))
    return connections[node]
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
    console.info('Received msg ', msg)
    console.info(this)
    let m = JSON.parse(msg.data)

    if (m.op === 'msg') {
      connections[TCP.extractNode(msg)].onData(TCP.extractPayload(msg))
    } if (m.op === 'event') {
      if (m.event === 'open') {
        connections[TCP.extractNode(msg)].onOpen()
      } else if (m.event === 'close') {
        connections[TCP.extractNode(msg)].onClose()
        connections[TCP.extractNode(msg)] = undefined
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
    console.info('Send: ', message)
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
