import * as AT from './actionTypes'
import {makeActionCreator} from '../helper'

export const startSocket = makeActionCreator(AT.START_SOCKET)
export const stopSocket = makeActionCreator(AT.STOP_SOCKET)

export const onSocketOpen = makeActionCreator(AT.SOCKET_OPENED, 'peer')
export const onSocketClose = makeActionCreator(AT.SOCKED_CLOSED, 'peer')

export const onPeerOpen = makeActionCreator(AT.PEER_OPEN, 'peer')
export const onPeerMessage = makeActionCreator(AT.PEER_MESSAGE, 'peer', 'msg')
export const onPeerClose = makeActionCreator(AT.PEER_CLOSE, 'peer')
