import bitcoin from './bitcoin'
import delegate from './delegate'
import ethereum from './ethereum'
import bch from './bch'
import kvStore from './kvStore'
import misc from './misc'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import wallet from './wallet'
import fetchService from './fetch'

export default ({ options, apiCode } = {}) => {
  const { get, post } = fetchService({ apiCode })
  const apiUrl = options.domains.api
  const rootUrl = options.domains.root
  const shapeShiftApiKey = options.platforms.web.shapeshift.config.apiKey

  return {
    ...bitcoin({ rootUrl, apiUrl, get, post }),
    ...delegate({ rootUrl, apiUrl, get, post }),
    ...ethereum({ rootUrl, apiUrl, get, post }),
    ...bch({ rootUrl, apiUrl, get, post }),
    ...kvStore({ apiUrl }),
    ...misc({ rootUrl, apiUrl, get, post }),
    ...sfox({ rootUrl }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftApiKey }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
