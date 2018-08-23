import { whereEq, identity, compose, prop } from 'ramda'
import { noop } from '../utils/functional'

const isHeartbeatMsg = whereEq({
  channel: 'heartbeat',
  type: 'heartbeat'
})
const isServerRebootMsg = whereEq({
  channel: 'server',
  type: 'rebooting',
  sequenceNumber: 0
})

export default class ApiSocket {
  constructor ({ options = {}, url, maxReconnects = Infinity }) {
    this.wsUrl = url
    this.headers = { Origin: options.domains.root }
    this.maxReconnects = maxReconnects
  }
  rebootTimeout = 5000
  heartbeatInterval = 6000
  heartbeatIntervalPID = null
  reconnect = null
  reconnectCount = 0

  connect (
    onOpen = identity,
    onMessage = identity,
    onClose = identity,
    onError = identity,
    fallback = noop
  ) {
    if (this.reconnectCount >= this.maxReconnects) {
      this.stopReconnecting()
      fallback()
      return
    }
    if (!this.socket || this.socket.readyState === 3) {
      try {
        this.socket = new WebSocket(this.wsUrl)
        this.socket.onopen = onOpen
        this.socket.onmessage = compose(
          onMessage,
          this.handleSystemMessage,
          this.extractMessage
        )
        this.socket.onclose = onClose
        this.socket.onerror = onError
        this.reconnect = this.connect.bind(
          this,
          onOpen,
          onMessage,
          onClose,
          onError,
          fallback
        )
        this.heartbeatIntervalPID = setInterval(
          this.tryToReconnect,
          this.heartbeatInterval
        )
      } catch (e) {
        onError(e)
      }
    }
  }

  extractMessage (msg) {
    return compose(
      JSON.parse,
      prop('data')
    )(msg)
  }

  send = message => {
    if (this.isReady()) {
      this.socket.send(JSON.stringify(message))
    }
  }

  handleSystemMessage = msg => {
    if (isHeartbeatMsg(msg)) {
      this.stopReconnecting()
      this.heartbeatIntervalPID = setInterval(
        this.tryToReconnect,
        this.heartbeatInterval
      )
    }
    if (isServerRebootMsg(msg)) {
      this.stopReconnecting()
      setTimeout(this.tryToReconnect, this.rebootTimeout)
    }
    return msg
  }

  close = () => {
    if (this.socket) {
      this.socket.close()
      this.socket.onopen = null
      this.socket.onmessage = null
      this.socket.onclose = null
      this.socket.onerror = null
    }
    this.socket = null
    clearInterval(this.heartbeatIntervalPID)
  }

  stopReconnecting = () => {
    this.reconnectCount = 0
    clearInterval(this.heartbeatIntervalPID)
  }

  tryToReconnect = () => {
    this.close()
    this.reconnectCount++
    this.reconnect()
  }

  isReady = () => this.socket && this.socket.readyState === 1
}
