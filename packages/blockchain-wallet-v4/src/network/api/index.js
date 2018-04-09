import bitcoin from './bitcoin'
import delegate from './delegate'
import ethereum from './ethereum'
import bch from './bch'
import kvStore from './kvStore'
import misc from './misc'
import options from './options'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import wallet from './wallet'
import fetchService from './fetch'

export const SHAPESHIFT_IO = 'https://shapeshift.io/'
export const SHAPESHIFT_API_KEY = 'b7a7c320c19ea3a8e276c8921bc3ff79ec064d2cd9d98ab969acc648246b4be5ab2379af704c5d3a3021c0ddf82b3e479590718847c1301e1a85331d2d2a8370'

export default ({ rootUrl, apiUrl, apiCode, shapeShiftRootUrl = SHAPESHIFT_IO, shapeShiftApiKey = SHAPESHIFT_API_KEY } = {}) => {
  const { get, post } = fetchService({ apiCode })

  return {
    ...bitcoin({ rootUrl, apiUrl, get, post }),
    ...delegate({ rootUrl, apiUrl, get, post }),
    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...bch({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...options({ rootUrl, apiUrl, get, post }),
    ...sfox({ rootUrl }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftRootUrl, shapeShiftApiKey }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
