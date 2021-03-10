import Task from 'data.task'
import { compose, curry, dissoc, prop, set } from 'ramda'

import * as KV from '../../../types/KVStoreEntry'

const eitherToTask = e => e.fold(Task.rejected, Task.of)

const parseError = error => {
  if (prop('status', error) === 404) return null
  throw error
}

const toTask = promise =>
  new Task((reject, resolve) => promise.then(resolve, reject))

export default ({ apiUrl, get, networks, put }) => {
  const updateKVStore = kv => {
    let createEncPayloadBuffer = kv.encKeyBuffer
      ? compose(KV.B64ToBuffer, KV.encrypt(kv.encKeyBuffer), JSON.stringify)
      : compose(KV.StringToBuffer, JSON.stringify)

    let encPayloadBuffer = createEncPayloadBuffer(kv.value)
    let signatureBuffer = KV.computeSignature(
      kv.signKey,
      encPayloadBuffer,
      kv.magicHash,
      networks.btc
    )

    let body = {
      version: kv.VERSION,
      payload: encPayloadBuffer.toString('base64'),
      signature: signatureBuffer.toString('base64'),
      prev_magic_hash: kv.magicHash ? kv.magicHash.toString('hex') : null,
      type_id: kv.typeId
    }

    const request = put({
      url: apiUrl,
      endPoint: `/metadata/${kv.address}`,
      contentType: 'application/json',
      data: body,
      transformRequest: compose(
        JSON.stringify,
        dissoc('api_code'),
        dissoc('ct')
      )
    }).catch(parseError)
    return toTask(request).map(res => {
      let magicHash = KV.magic(encPayloadBuffer, kv.magicHash, networks.btc)
      return set(KV.magicHash, magicHash, kv)
    })
  }

  const fetchKVStore = kv => {
    let setKvFromResponse = curry((currentKv, res) => {
      if (res === null) return set(KV.value, null, currentKv)
      let setFromResponse = compose(
        set(KV.magicHash, prop('compute_new_magic_hash', res)),
        set(KV.value, KV.extractResponse(kv.encKeyBuffer, res))
      )
      return setFromResponse(currentKv)
    })
    const request = get({
      url: apiUrl,
      endPoint: `/metadata/${kv.address}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    }).catch(parseError)
    return toTask(request)
      .map(KV.verifyResponse(kv.address, networks.btc))
      .chain(eitherToTask)
      .map(setKvFromResponse(kv))
      .rejectedMap(e => {
        // eslint-disable-next-line no-console
        console.error(
          `Failed to fetch metadata entry ${kv.typeId} at ${kv.address}:`,
          e
        )
        return new Error('METADATA_FETCH_FAILED')
      })
  }

  return {
    fetchKVStore,
    updateKVStore
  }
}
