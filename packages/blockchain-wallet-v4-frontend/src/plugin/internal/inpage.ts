import { WindowPostMessageStream } from '@metamask/post-message-stream'
import { initializeProvider } from 'plugin/provider'
import { Duplex } from 'stream'

import { CONTENT_SCRIPT, INPAGE } from './contentScript'

// setup connection with responsible content script
const stream = new WindowPostMessageStream({
  name: INPAGE,
  target: CONTENT_SCRIPT
})

initializeProvider(stream as unknown as Duplex)
