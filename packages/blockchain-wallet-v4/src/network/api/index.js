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
    ...bitcoin({ apiUrl, rootUrl, get, post }),
    ...delegate({ rootUrl, get, post }),
    ...ethereum({ apiUrl, get, post }),
    ...bch({ apiUrl, rootUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...misc({ apiUrl, rootUrl, get, post }),
    ...options({ rootUrl, get, post }),
    ...sfox({ }),
    ...settings({ rootUrl, get, post }),
    ...shapeShift({ shapeShiftRootUrl, shapeShiftApiKey }),
    ...wallet({ rootUrl, get, post })
  }
}
