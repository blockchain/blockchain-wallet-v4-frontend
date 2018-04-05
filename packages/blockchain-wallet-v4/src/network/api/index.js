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
    ...bitcoin({ get, post }),
    ...delegate({ get, post }),
    ...ethereum({ get, post }),
    ...bch({ get, post }),
    ...kvStore({ }),
    ...misc({ get, post }),
    ...options({ get, post }),
    ...sfox({ }),
    ...settings({ get, post }),
    ...shapeShift({ shapeShiftRootUrl, shapeShiftApiKey }),
    ...wallet({ get, post })
  }
}
