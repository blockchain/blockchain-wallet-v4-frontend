import addressesBch from './addressesBch/sagas'
import profile from './profile/sagas.ts'
import rates from './rates/sagas'
import securityCenter from './securityCenter/sagas'
import settings from './settings/sagas'
import transferEth from './transferEth/sagas'

export default ({ api, coreSagas, networks }) => ({
  addressesBch: addressesBch({ coreSagas }),
  profile: profile({ api, coreSagas, networks }),
  rates: rates({ api }),
  settings: settings({ api, coreSagas }),
  securityCenter: securityCenter({ coreSagas }),
  transferEth: transferEth({ coreSagas, networks })
})
