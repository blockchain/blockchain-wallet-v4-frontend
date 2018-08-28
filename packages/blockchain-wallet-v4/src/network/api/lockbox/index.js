export default ({ rootUrl, get, post }) => {
  const getFinalFirmware = () =>
    get({
      url: rootUrl,
      endPoint: '/firmware_final_versions',
      data: {}
    })

  const getCurrentFirmware = () =>
    post({
      url: rootUrl,
      endPoint: '/get_firmware_version',
      contentType: 'application/json',
      data: {}
    })

  const getDeviceVersion = () =>
    post({
      url: rootUrl,
      endPoint: '/get_device_version',
      contentType: 'application/json',
      data: {}
    })

  const getCurrentOsu = () =>
    post({
      url: rootUrl,
      endPoint: '/get_osu_version',
      contentType: 'application/json',
      data: {}
    })

  const getLatestFirmware = () =>
    post({
      url: rootUrl,
      endPoint: '/get_latest_firmware',
      contentType: 'application/json',
      data: {}
    })

  const getMcus = () =>
    get({
      url: rootUrl,
      endPoint: '/mcu_versions',
      contentType: 'application/json',
      data: {}
    })

  const getNextMcu = () =>
    post({
      url: rootUrl,
      endPoint: '/mcu_versions_bootloader',
      contentType: 'application/json',
      data: {}
    })

  return {
    getFinalFirmware,
    getCurrentFirmware,
    getDeviceVersion,
    getCurrentOsu,
    getLatestFirmware,
    getMcus,
    getNextMcu
  }
}
