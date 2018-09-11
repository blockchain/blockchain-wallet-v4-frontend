import { Socket } from 'blockchain-wallet-v4/src/network'
import { Observable } from 'rxjs'

/**
 * Creates device socket
 * @param {Transport} transport - Current device transport
 * @param {String} url - The web socket url to connect to
 * @returns {Observable} the final socket result
 */
export const createDeviceSocket = (transport, url) => {
  return Observable.create(o => {
    let ws, lastMessage

    debugger
    try {
      ws = new Socket(url)
    } catch (err) {
      o.error(err.message, { url })
      return () => {}
    }

    ws.on('open', () => {
      console.info('OPENED', { url })
    })

    ws.on('error', e => {
      console.info('ERROR', { message: e.message, stack: e.stack })
      o.error(e.message, { url })
    })

    ws.on('close', () => {
      console.info('CLOSE')
      o.next(lastMessage || '')
      o.complete()
    })

    const send = (nonce, response, data) => {
      const msg = {
        nonce,
        response,
        data,
      }
      console.info('SEND', msg)
      const strMsg = JSON.stringify(msg)
      ws.send(strMsg)
    }

    const handlers = {
      exchange: async input => {
        const { data, nonce } = input
        const res = await transport.exchange(Buffer.from(data, 'hex'))
        const status = res.slice(res.length - 2)
        const buffer = res.slice(0, res.length - 2)
        const strStatus = status.toString('hex')
        send(nonce, strStatus === '9000' ? 'success' : 'error', buffer.toString('hex'))
      },

      bulk: async input => {
        const { data, nonce } = input

        // Execute all apdus and collect last status
        let lastStatus = null
        for (const apdu of data) {
          const res = await transport.exchange(Buffer.from(apdu, 'hex'))
          lastStatus = res.slice(res.length - 2)

          if (lastStatus.toString('hex') !== '9000') break
        }

        if (!lastStatus) {
          throw new Error('DeviceSocketNoBulkStatus')
        }

        const strStatus = lastStatus.toString('hex')

        send(
          nonce,
          strStatus === '9000' ? 'success' : 'error',
          strStatus === '9000' ? '' : strStatus,
        )
      },

      success: msg => {
        lastMessage = msg.data || msg.result
        ws.close()
      },

      error: msg => {
        console.info('ERROR', { data: msg.data })
        throw new Error(msg.data, { url })
      },
    }

    const stackMessage = async rawMsg => {
      try {
        const msg = JSON.parse(rawMsg)
        if (!(msg.query in handlers)) {
          throw new Error(`Cannot handle msg of type ${msg.query}`, {
            query: msg.query,
            url,
          })
        }
        console.info('RECEIVE', msg)
        await handlers[msg.query](msg)
      } catch (err) {
        console.info('ERROR', { message: err.message, stack: err.stack })
        o.error(err)
      }
    }

    ws.on('message', async rawMsg => {
      stackMessage(rawMsg)
    })

    return () => {
      if (ws.readyState === 1) {
        lastMessage = null
        ws.close()
      }
    }
  })
}
