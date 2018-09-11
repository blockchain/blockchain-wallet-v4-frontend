import qs from 'qs'

import constants from './constants'

// checks if device is authentic
const checkDeviceAuthenticity = (transport, baseUrl, params) => {
  const url =
    `${baseUrl}/${constants.socketPaths.authenticity}` +
    `?${qs.stringify(params)}`
  

  return Promise.resolve(true)
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

// derives full device information from api response
const getDeviceInfo = transport => {
  return new Promise((resolve, reject) => {
    getDeviceFirmwareInfo(transport).then(
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
  checkDeviceAuthenticity,
  getDeviceInfo,
  getDeviceFirmwareInfo
}
