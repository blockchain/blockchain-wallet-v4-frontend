export default ({ ledgerUrl, get, post }) => {
  const getFinalFirmware = () =>
    get({
      url: ledgerUrl,
      endPoint: '/firmware_final_versions',
      data: {}
    })

  const getCurrentFirmware = () =>
    post({
      url: ledgerUrl,
      endPoint: '/get_firmware_version',
      contentType: 'application/json',
      data: {}
    })

  const getDeviceVersion = (provider, target_id) =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_device_version',
      contentType: 'application/json',
      data: { provider, target_id }
    })

  const getCurrentOsu = () =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_osu_version',
      contentType: 'application/json',
      data: {}
    })

  const getLatestFirmware = () =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_latest_firmware',
      contentType: 'application/json',
      data: {}
    })

  const getMcus = () =>
    get({
      url: ledgerUrl,
      endPoint: '/api/mcu_versions',
      contentType: 'application/json',
      data: {}
    })

  const getNextMcu = bootLoaderVersion =>
    post({
      url: ledgerUrl,
      endPoint: '/api/mcu_versions_bootloader',
      contentType: 'application/json',
      data: {
        bootloader_version: bootLoaderVersion
      }
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
