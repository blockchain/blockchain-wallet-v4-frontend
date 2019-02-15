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

let toArrayFormat = a => (Array.isArray(a) ? a : [a])

class Socket {
  constructor ({ options = {}, url }) {
    this.wsUrl = url
    this.headers = { Origin: options.domains.root }
  }
  pingInterval = 30000
  pingIntervalPID = null
  pingTimeout = 5000
  pingTimeoutPID = null
  reconnect = null
  reconnectCount = 0

  connect (
    onOpen = identity,
    onMessage = identity,
    onClose = identity,
    onError = identity
  ) {
    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.pingIntervalPID = setInterval(this.ping, this.pingInterval)
        this.socket = new WS(this.wsUrl, [], { headers: this.headers })
        this.socket.on('open', onOpen)
        this.socket.on(
          'message',
          compose(
            onMessage,
            this.onPong,
            this.extractMessage
          )
        )
        this.socket.on('close', onClose)
        this.socket.on('error', onError)
        this.reconnect = this.connect.bind(this, onOpen, onMessage, onClose)
      } catch (e) {
        console.error('Failed to connect to websocket', e)
      }
    }
  }

  extractMessage (msg) {
    return compose(
      JSON.parse,
      prop('data')
    )(msg)
  }

  send (message) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(message)
    }
  }

  ping = () => {
    this.send(Socket.pingMessage())
    this.pingTimeoutPID = setTimeout(
      compose(
        this.reconnect,
        this.close
      ),
      this.pingTimeout
    )
  }

  onPong = msg => {
    if (propEq('op', 'pong')) {
      clearTimeout(this.pingTimeoutPID)
    }
    return msg
  }

  close = () => {
    if (this.socket) {
      this.socket.close()
      this.socket.off('open')
      this.socket.off('message')
      this.socket.off('close')
      this.socket.off('error')
    }
    this.socket = null
    clearInterval(this.pingIntervalPID)
    clearTimeout(this.pingTimeoutPID)
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
    let toMsg = addr => JSON.stringify({ op: 'addr_sub', addr })
    return toArrayFormat(addresses)
      .map(toMsg)
      .reduce(concat, '')
  }

  static xPubSubMessage (xpubs) {
    if (xpubs == null) return ''
    let toMsg = xpub => JSON.stringify({ op: 'xpub_sub', xpub })
    return toArrayFormat(xpubs)
      .map(toMsg)
      .reduce(concat, '')
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
