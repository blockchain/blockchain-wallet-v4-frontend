import { Observable } from 'rxjs'

import firmware from './firmware'
import constants from './constants'

/* eslint-disable */
// TODO: enable eslint after dev complete

/**
 * Creates device socket
 * @param {Transport} transport - Current device transport
 * @param {String} url - The web socket url to connect to
 * @returns {Observable} the final socket result
 */
const createDeviceSocket = (transport, url) => {
  return Observable.create(o => {
    let ws, lastMessage

    try {
      ws = new WebSocket(url)
    } catch (err) {
      o.error(err.message, { url })
      return () => {}
    }

    ws.onopen = () => {
      console.info('OPENED', { url })
    }

    ws.onerror = e => {
      console.info('ERROR', { message: e.message, stack: e.stack })
      o.error(e.message, { url })
    }

    ws.onclose = () => {
      console.info('CLOSE')
      o.next(lastMessage || '')
      o.complete()
    }

    ws.onmessage = async rawMsg => {
      try {
        const msg = JSON.parse(rawMsg.data)
        if (!(msg.query in handlers)) {
          return new Error(`Cannot handle msg of type ${msg.query}`, {
            query: msg.query,
            url
          })
        }
        console.info('RECEIVE', msg)
        await handlers[msg.query](msg)
      } catch (err) {
        console.info('ERROR', { message: err.message, stack: err.stack })
        o.error(err)
      }
    }

    const send = (nonce, response, data) => {
      const msg = {
        nonce,
        response,
        data
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
        send(
          nonce,
          strStatus === '9000' ? 'success' : 'error',
          buffer.toString('hex')
        )
      },

      bulk: async input => {
        const { data, nonce } = input
        let lastStatus // Execute all apdus and collect last status

        for (const apdu of data) {
          const res = await transport.exchange(Buffer.from(apdu, 'hex'))
          lastStatus = res.slice(res.length - 2)

          if (lastStatus.toString('hex') !== '9000') break
        }

        if (!lastStatus) {
          return new Error('DeviceSocketNoBulkStatus')
        }

        const strStatus = lastStatus.toString('hex')

        send(
          nonce,
          strStatus === '9000' ? 'success' : 'error',
          strStatus === '9000' ? '' : strStatus
        )
      },

      success: msg => {
        lastMessage = msg.data || msg.result
        ws.close()
      },

      error: msg => {
        console.info('ERROR', { data: msg.data })
        ws.close()
        return new Error(msg.data, { url })
      }
    }

    return () => {
      if (ws.readyState === 1) {
        lastMessage = null
        ws.close()
      }
    }
  })
}
/* eslint-enable */

// derives full device information from api response
const getDeviceInfo = transport => {
  return new Promise((resolve, reject) => {
    firmware.getDeviceFirmwareInfo(transport).then(
      res => {
        const { seVersion } = res
        const { targetId, mcuVersion, flags } = res
        const parsedVersion =
          seVersion.match(
            /([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-z]+))?(-osu)?/
          ) || []
        const isOSU = typeof parsedVersion[5] !== 'undefined'
        const providerName = parsedVersion[4] || ''
        const providerId = constants.providers[providerName]
        const isBootloader = targetId === 0x01000001
        const majMin = parsedVersion[1]
        const patch = parsedVersion[2] || '.0'
        const fullVersion = `${majMin}${patch}${
          providerName ? `-${providerName}` : ''
        }`
        resolve({
          targetId,
          seVersion: majMin + patch,
          isOSU,
          mcuVersion,
          isBootloader,
          providerName,
          providerId,
          flags,
          fullVersion
        })
      },
      err => {
        reject(err)
      }
    )
  })
}

export default {
  createDeviceSocket,
  getDeviceInfo
}
