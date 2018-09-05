import api from 'blockchain-wallet-v4/src/network/api/lockbox'

// get current device mcu
// get latest device mcu
// update device mcu

const getMcus = async () => {
  const { data } = await api.getMcus()

  return data
}
// const getNextMcu = () => {
//   const { seVersion: version, targetId }: DeviceInfo = await getDeviceInfo(transport)
//   const nextVersion = await getNextMCU(version)
// }

// export default async (bootloaderVersion: string): Promise<*> => {
//   const { data }: NetworkResponse = await network({
//     method: 'POST',
//     url: GET_NEXT_MCU,
//     data: {
//       bootloader_version: bootloaderVersion,
//     },
//   })
//
//   // FIXME: nextVersion will not be able to "default" when
//   // Error handling is standardize on the API side
//   if (data === 'default' || !data.name) {
//     throw new LatestMCUInstalledError('there is no next mcu version to install')
//   }
//   return data
// }
//
// export default async (transport: Transport<*>): Result => {
//   const { seVersion: version, targetId }: DeviceInfo = await getDeviceInfo(transport)
//   const nextVersion = await getNextMCU(version)
//   const params = {
//     targetId,
//     version: nextVersion.name,
//   }
//   const url = WS_MCU(params)
//   await remapSocketError(createDeviceSocket(transport, url).toPromise())
// }

export default {
  getMcus
}
