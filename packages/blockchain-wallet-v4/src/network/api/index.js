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

export default ({ rootUrl, apiUrl, apiCode, shapeShiftRootUrl, shapeShiftApiKey } = {}) => {
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
