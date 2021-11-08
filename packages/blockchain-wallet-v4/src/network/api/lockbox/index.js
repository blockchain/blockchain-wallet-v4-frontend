export default ({ get, ledgerUrl, post }) => {
  const getApplications = (req) =>
    post({
      contentType: 'application/json',
      data: req,
      endPoint: '/api/get_apps',
      url: ledgerUrl
    })

  const getFinalFirmwareById = (id) =>
    get({
      contentType: 'application/json',
      endPoint: `/api/firmware_final_versions/${id}`,
      ignoreQueryParams: true,
      url: ledgerUrl
    })

  const getDeviceVersion = (req) =>
    post({
      contentType: 'application/json',
      data: req,
      endPoint: '/api/get_device_version',
      url: ledgerUrl
    })

  const getCurrentFirmware = (req) =>
    post({
      contentType: 'application/json',
      data: req,
      endPoint: '/api/get_firmware_version',
      url: ledgerUrl
    })

  const getLatestFirmware = (req) =>
    post({
      contentType: 'application/json',
      data: req,
      endPoint: '/api/get_latest_firmware',
      url: ledgerUrl
    })

  const getCurrentOsu = () =>
    post({
      contentType: 'application/json',
      data: {},
      endPoint: '/api/get_osu_version',
      url: ledgerUrl
    })

  const getMcus = () =>
    get({
      contentType: 'application/json',
      endPoint: '/api/mcu_versions',
      ignoreQueryParams: true,
      url: ledgerUrl
    })

  const getNextMcu = (bootLoaderVersion) =>
    post({
      contentType: 'application/json',
      data: {
        bootloader_version: bootLoaderVersion
      },
      endPoint: '/api/mcu_versions_bootloader',
      url: ledgerUrl
    })

  return {
    getApplications,
    getCurrentFirmware,
    getCurrentOsu,
    getDeviceVersion,
    getFinalFirmwareById,
    getLatestFirmware,
    getMcus,
    getNextMcu
  }
}
