import * as AT from './actionTypes'
import {makeActionCreator} from '../helper'

export const refresh = makeActionCreator(AT.REFRESH, 'payload')
export const remove = makeActionCreator(AT.REMOVE, 'channelId')

export const open = makeActionCreator(AT.MESSAGE, 'peer', 'msg')
export const onMessage = makeActionCreator(AT.OPEN, 'peer', 'msg')
