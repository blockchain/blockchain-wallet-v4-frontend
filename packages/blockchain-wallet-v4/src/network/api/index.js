import bitcoin from './btc'
import delegate from './delegate'
import ethereum from './eth'
import bch from './bch'
import kvStore from './kvStore'
import misc from './misc'
import onfido from './onfido'
import settings from './settings'
import shapeShift from './shapeShift'
import sfox from './sfox'
import wallet from './wallet'
import fetchService from './fetch'

export default ({ options, apiKey } = {}) => {
  const { get, post } = fetchService({ apiKey })
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
    ...onfido({ rootUrl, get, post }),
    ...sfox({ rootUrl }),
    ...settings({ rootUrl, apiUrl, get, post }),
    ...shapeShift({ shapeShiftApiKey }),
    ...wallet({ rootUrl, apiUrl, get, post })
  }
}
