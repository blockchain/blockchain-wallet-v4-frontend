import qs from 'qs'

import utils from './utils'
import constants from './constants'

// checks if device is authentic
const checkDeviceAuthenticity = (transport, baseUrl, params) => {
  return new Promise(async (resolve, reject) => {
    const url =
      `${baseUrl}${constants.socketPaths.authenticity}` +
      `?${qs.stringify(params)}`

    // check authenticity
    const res = await utils.mapSocketError(
      utils.createDeviceSocket(transport, url).toPromise()
    )
    /* eslint-disable  prefer-promise-reject-errors */
    !res || res !== '0000' || res.errMsg ? reject(false) : resolve(true)
    /* eslint-enable  prefer-promise-reject-errors */
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

// installs osu firmware on device
const installOsuFirmware = (transport, baseUrl, osuFirmware, targetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // socket params
      const params = {
        targetId,
        ...osuFirmware,
        firmwareKey: osuFirmware.firmware_key
      }
      delete params.shouldFlashMcu

      // build socket url
      const url =
        `${baseUrl}${constants.socketPaths.install}` +
        `?${qs.stringify(params)}`

      // install osu firmware
      const res = await utils.mapSocketError(
        utils.createDeviceSocket(transport, url).toPromise()
      )

      if (res.err) {
        reject(res.errMsg)
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

// installs final firmware on device
const installFinalFirmware = (transport, baseUrl, finalFirmware, targetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // socket params
      const params = {
        targetId,
        ...finalFirmware,
        firmwareKey: finalFirmware.firmware_key
      }

      // build socket url
      const url =
        `${baseUrl}${constants.socketPaths.install}` +
        `?${qs.stringify(params)}`

      // install final firmware
      const res = await utils.mapSocketError(
        utils.createDeviceSocket(transport, url).toPromise()
      )

      if (res.err) {
        reject(res.errMsg)
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  checkDeviceAuthenticity,
  getDeviceFirmwareInfo,
  installFinalFirmware,
  installOsuFirmware
}
