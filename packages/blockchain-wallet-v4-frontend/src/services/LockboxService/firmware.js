import qs from 'qs'

import utils from './utils'
import constants from './constants'

// checks if device is authentic
const checkDeviceAuthenticity = (transport, baseUrl, params) => {
  return new Promise(async (resolve, reject) => {
    const url =
      `${baseUrl}${constants.socketPaths.authenticity}` +
      `?${qs.stringify(params)}`

    const res = await utils.createDeviceSocket(transport, url).toPromise()

    !res || res !== '0000'
      ? reject(new Error('device authenticity failed'))
      : resolve(res)
  })
}

// gets firmware information about device
const getDeviceFirmwareInfo = transport => {
  return new Promise((resolve, reject) => {
    transport.send(...constants.apdus.get_firmware).then(
      res => {
        const byteArray = [...res]
        const data = byteArray.slice(0, byteArray.length - 2)
        const targetIdStr = Buffer.from(data.slice(0, 4))
        const targetId = targetIdStr.readUIntBE(0, 4)
        const seVersionLength = data[4]
        const seVersion = Buffer.from(
          data.slice(5, 5 + seVersionLength)
        ).toString()
        const flagsLength = data[5 + seVersionLength]
        const flags = Buffer.from(
          data.slice(
            5 + seVersionLength + 1,
            5 + seVersionLength + 1 + flagsLength
          )
        ).toString()

        const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength]
        let mcuVersion = Buffer.from(
          data.slice(
            7 + seVersionLength + flagsLength,
            7 + seVersionLength + flagsLength + mcuVersionLength
          )
        )
        if (mcuVersion[mcuVersion.length - 1] === 0) {
          mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1)
        }
        mcuVersion = mcuVersion.toString()

        if (!seVersionLength) {
          resolve({
            targetId,
            seVersion: '0.0.0',
            flags: '',
            mcuVersion: ''
          })
        }
        resolve({ targetId, seVersion, flags, mcuVersion })
      },
      error => {
        reject(error)
      }
    )
  })
}

export default {
  checkDeviceAuthenticity,
  getDeviceFirmwareInfo
}
