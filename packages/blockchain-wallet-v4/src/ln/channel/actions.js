import * as AT from './actionTypes'
import {makeActionCreator} from '../helper'

export const refresh = makeActionCreator(AT.REFRESH, 'payload')
export const remove = makeActionCreator(AT.REMOVE, 'channelId')

// Open a payment channel with `publicKey` for `value` amount
export const open = makeActionCreator(AT.OPEN, 'publicKey', 'value')
export const onMessage = makeActionCreator(AT.MESSAGE, 'peer', 'msg')

export const opened = makeActionCreator(AT.OPENED, 'channelId')
