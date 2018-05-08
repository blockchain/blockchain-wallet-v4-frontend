import { compose, concat, prop, propEq, identity } from 'ramda'

const WebSocket = global.WebSocket || global.MozWebSocket

function WS (uri, protocols, opts) {
  return protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)
}

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

let toArrayFormat = (a) => Array.isArray(a) ? a : [a]

class Socket {
  constructor ({ options = {}, socketType }) {
    this.wsUrl = options.domains[socketType]
    this.headers = { 'Origin': options.domains.root }
    this.pingInterval = 30000
    this.pingIntervalPID = null
    this.pingTimeout = 5000
    this.pingTimeoutPID = null
    this.reconnect = null
  }

  connect (onOpen = identity, onMessage = identity, onClose = identity) {
    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.pingIntervalPID = setInterval(this.ping.bind(this), this.pingInterval)
        this.socket = new WS(this.wsUrl, [], { headers: this.headers })
        this.socket.on('open', onOpen)
        this.socket.on('message', compose(onMessage, this.onPong.bind(this), this.extractMessage.bind(this)))
        this.socket.on('close', onClose)
        this.reconnect = this.connect.bind(this, onOpen, onMessage, onClose)
      } catch (e) {
        console.error('Failed to connect to websocket', e)
      }
    }
  }

  ping () {
    this.send(Socket.pingMessage())
    let close = this.close.bind(this)
    this.pingTimeoutPID = setTimeout(compose(this.reconnect, close), this.pingTimeout)
  }

  onPong (msg) {
    if (propEq('op', 'pong')) { clearTimeout(this.pingTimeoutPID) }
    return msg
  }

  extractMessage (msg) {
    return compose(JSON.parse, prop('data'))(msg)
  }

  close () {
    if (this.socket) this.socket.close()
    this.socket = null
    clearInterval(this.pingIntervalPID)
    clearTimeout(this.pingTimeoutPID)
  }

  send (message) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(message)
    }
  }

  static walletSubMessage (guid) {
    if (guid == null) return ''
    return JSON.stringify({ op: 'wallet_sub', guid })
  }

  static blockSubMessage () {
    return JSON.stringify({ op: 'blocks_sub' })
  }

  static addrSubMessage (addresses) {
    if (addresses == null) return ''
    let toMsg = (addr) => JSON.stringify({ op: 'addr_sub', addr })
    return toArrayFormat(addresses).map(toMsg).reduce(concat, '')
  }

  static xPubSubMessage (xpubs) {
    if (xpubs == null) return ''
    let toMsg = (xpub) => JSON.stringify({ op: 'xpub_sub', xpub })
    return toArrayFormat(xpubs).map(toMsg).reduce(concat, '')
  }

  static pingMessage () {
    return JSON.stringify({ op: 'ping' })
  }

  static onOpenMessage ({ guid, addresses, xpubs }) {
    return (
      Socket.blockSubMessage() +
      Socket.walletSubMessage(guid) +
      Socket.addrSubMessage(addresses) +
      Socket.xPubSubMessage(xpubs)
    )
  }
}

export default Socket
