import { path, curry } from 'ramda'

export const getChannelDir = path(['ln', 'channel'])
export const getChannel = curry((channel) => path(['ln', 'channel', channel]))
