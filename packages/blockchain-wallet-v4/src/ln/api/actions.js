import * as AT from './actionTypes'
import {makeActionCreator} from '../helper'

const createApiAction = (actions, eventArgs = [], successArgs = [], errorArgs = ['error']) => ({
  EVENT: makeActionCreator(actions.EVENT, eventArgs),
  SUCCESS: makeActionCreator(actions.SUCCESS, successArgs),
  ERROR: makeActionCreator(actions.ERROR, errorArgs)
})

export const startup = createApiAction(AT.STARTUP)

export const openChannel = createApiAction(AT.OPEN_CHANNEL, ['pubKey', 'value'], ['channelId'], ['pubKey', 'error'])
export const closeChannel = createApiAction(AT.CLOSE_CHANNEL, ['channelId'], ['channelId'])

// TODO do we have any way to reference to send / receive actions for success / failure messages
export const send = createApiAction(AT.SEND, ['address', 'value'])
export const receive = createApiAction(AT.RECEIVE, ['value'])

export const received = makeActionCreator(AT.RECEIVED, ['paymentHash', 'value'])
