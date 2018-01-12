// Actions caught by reducer
export const START_SOCKET = '@LN.TCP_RELAY.START'
export const STOP_SOCKET = '@LN.TCP_RELAY.STOP'

export const SOCKET_OPENED = '@LN.TCP_RELAY.OPENED'
export const SOCKED_CLOSED = '@LN.TCP_RELAY.CLOSED'

// Actions caught by sagas
export const PEER_OPEN = '@LN.TCP_RELAY.PEER.OPENED'
export const PEER_MESSAGE = '@LN.TCP_RELAY.PEER.MESSAGE'
export const PEER_CLOSE = '@LN.TCP_RELAY.PEER.CLOSED'
