import * as AT from './actionTypes'
import {makeActionCreator} from '../helper'

export const refresh = makeActionCreator(AT.REFRESH, 'payload')
export const remove = makeActionCreator(AT.REMOVE, 'channelId')

export const open = makeActionCreator(AT.OPEN, 'options')
export const onMessage = makeActionCreator(AT.MESSAGE, 'peer', 'msg')
