import Task from 'data.task'
import { TrezorConnect } from './trezorConnect.js'

// getXPUB : String -> Task(Error, xpub)
export const getXPub = path =>
  new Task((reject, resolve) =>
    TrezorConnect.getXPubKey(path, (result) => {
      if (result.success) {
        resolve(result.xpubkey)
      } else {
        reject('TREZOR_CONNECTION_FAILED')
      }
    })
  )
