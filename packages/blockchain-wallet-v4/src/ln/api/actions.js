import * as AT from 'actionTypes'
import {makeActionCreator} from "../helper";

export const startup = makeActionCreator(AT.STARTUP)

export const openChannel = makeActionCreator(AT.OPEN_CHANNEL, 'pubKey', 'value')
export const closeChannel = makeActionCreator(AT.CLOSE_CHANNEL, 'channelId')

export const send = makeActionCreator(AT.SEND, 'address', 'value')
export const receive = makeActionCreator(AT.RECEIVE, 'value')
