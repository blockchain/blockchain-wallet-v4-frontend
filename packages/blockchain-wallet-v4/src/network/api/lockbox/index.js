export default ({ get, ledgerUrl, post }) => {
  const getApplications = req =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_apps',
      contentType: 'application/json',
      data: req
    })

  const getFinalFirmwareById = id =>
    get({
      url: ledgerUrl,
      endPoint: `/api/firmware_final_versions/${id}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const getDeviceVersion = req =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_device_version',
      contentType: 'application/json',
      data: req
    })

  const getCurrentFirmware = req =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_firmware_version',
      contentType: 'application/json',
      data: req
    })

  const getLatestFirmware = req =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_latest_firmware',
      contentType: 'application/json',
      data: req
    })

  const getCurrentOsu = () =>
    post({
      url: ledgerUrl,
      endPoint: '/api/get_osu_version',
      contentType: 'application/json',
      data: {}
    })

  const getMcus = () =>
    get({
      url: ledgerUrl,
      endPoint: '/api/mcu_versions',
      contentType: 'application/json',
      ignoreQueryParams: true
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
    getApplications,
    getFinalFirmwareById,
    getCurrentFirmware,
    getDeviceVersion,
    getCurrentOsu,
    getLatestFirmware,
    getMcus,
    getNextMcu
  }
}
