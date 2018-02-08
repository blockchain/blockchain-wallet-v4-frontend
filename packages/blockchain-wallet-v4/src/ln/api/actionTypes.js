// TODO I think we need to add various error types here. Is there a way to generalise error handling?

const createApiActionType = (name) => ({
  EVENT: name,
  SUCCESS: name + '.SUCCESS',
  ERROR: name + '.ERROR'
})

export const STARTUP = createApiActionType('@LN.API.STARTUP')

export const OPEN_CHANNEL = createApiActionType('@LN.API.OPEN_CHANNEL')
export const CLOSE_CHANNEL = createApiActionType('@LN.API.CLOSE_CHANNEL')

export const SEND = createApiActionType('@LN.API.SEND')
export const RECEIVE = createApiActionType('@LN.API.RECEIVE')

export const RECEIVED = '@LN.API.RECEIVED'
